import express from "express";
import axios from "axios";
import https from "https";
import dns from "dns";
import { APIProject } from "../models/Project.model.js";
import { APIKey } from "../models/Apikey.model.js";
import { matchRoute } from "../utils/pathMatcher.js";
import { Routes_cache } from "../cache/routes-cache.js";
import { toSortedQueryString } from "../utils/querynormaliser.js";
import { redis } from "../configs/connectredis.js";
import { cachekeyhash } from "../utils/cache-key-hasher.js";
import { createRequestLog } from "../services/create-request-log.js";
import { rateLimit } from "../utils/redis-ratelimit.js";

const gatewayRouter = express.Router();

// agent to ignore SSL issues (only temporary for dev)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

gatewayRouter.use("/:projectId", async (req, res) => {
  const initiationtime = Date.now();
  const { projectId } = req.params;
  const method = req.method.toUpperCase();
  const apiKey = req.get("x-safeapi-key");
  const origin = req.get("origin");
  const urlwithquery = req.url;
  const incommingurl = urlwithquery.split("?")[0];
  const queryobj = req.query;
  const normalizedquerystr = toSortedQueryString(queryobj);
  
  // Initialize routeinfo to avoid reference errors later if not set
  let routeinfo = {}; 
  let cached = false;

  // console.log(incommingurl, urlwithquery);

  try {
    // 1. Validate project
    const project = await APIProject.findOne({ projectId }).select(
      "originUrl status allowedOrigins rateLimit"
    );
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // 2. Check if origin allowed
    if (origin != undefined && !project.allowedOrigins.includes(origin)) {
      return res.status(503).json({ message: "origin not allowed" });
    }

    // 3. Authorize
    const isApikey = await APIKey.findOneAndUpdate(
      { projectId, key: apiKey, keystatus: "active" },
      { lastUsed: Date.now() }
    );
    
    if (!isApikey) {
      return res.status(403).json({ message: "Invalid/Disabled Apikey" });
    }
  
    // 4. Match and check if route valid and return the path
    let isvalidRoute = false;
    let urlpath = "";

    // FIX: Check if projectId exists in cache before accessing [method] to prevent crash
    if (!Routes_cache[projectId] || !Routes_cache[projectId][method]) {
        return res.status(404).json({ message: "Invalid Route/ProjectId" });
    }

    const pathsarray = Routes_cache[projectId][method];

    if (pathsarray.length == 0) {
      return res.status(404).json({ message: "Invalid Route/ProjectId" });
    }

    for (let i = 0; i < pathsarray.length; i++) {
      if (matchRoute(pathsarray[i].path, incommingurl).matched) {
        urlpath = pathsarray[i].path;
        routeinfo = pathsarray[i];
        isvalidRoute = true;
        break;
      }
    }

    if (!isvalidRoute) {
      return res.status(404).json({ message: "Invalid Route" });
    }

    // 5. Redirect only if active status
    if (project.status === "suspended") {
      return res.status(503).json({ message: "API Status : Suspended" });
    }

    const timebefore=Date.now();
    console.log(project.rateLimit);
    const rateLimitResult = await rateLimit(redis,apiKey,project.rateLimit,60); // n request per minute per key
    const timeafter=Date.now();
    console.log(timeafter-timebefore);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({ 
        message: `Rate limit exceeded for the key : ${isApikey.label} . Try again later.`,
        retryAfter: rateLimitResult.retryAfter+" seconds"
      });
    }

    // 6. Prepare redirect target
    const redirectUrl = `${project.originUrl}${incommingurl}${normalizedquerystr}`;
    const parsed = new URL(redirectUrl);
    
    if (parsed.protocol !== "https:") {
      return res.status(400).json({ error: "Only HTTPS URLs allowed" });
    }

    // Optional: DNS check to avoid SSRF
    await new Promise((resolve, reject) => {
      dns.lookup(parsed.hostname, (err, addr) => {
        if (err || !addr) reject("DNS lookup failed");
        else resolve();
      });
    });

    const cachekey = method + " " + redirectUrl;
    const hashedkey = cachekeyhash(cachekey);
    
    // 7. Check Cache
    const exists = await redis.exists(hashedkey);
    if (exists) {
      cached = true;
      const timebeforcache = Date.now();
      const value = await redis.get(hashedkey);
      const cachedresponse = JSON.parse(value);
      const timeaftercache = Date.now();
      
      res
        .status(cachedresponse.status)
        .set(cachedresponse.headers)
        .send(cachedresponse.data);
      // console.log("time taken by cache :", timeaftercache - timebeforcache);
      // Log and Return
      const MakeRequestLog = {
        projectId,
        keyId: isApikey._id,
        route: urlpath,
        cached,
        method,
        origin,
        statusCode: cachedresponse.status,
        latency: timeaftercache - initiationtime,
        user_api_latency: timeaftercache - timebeforcache,
      };
      
      await createRequestLog(MakeRequestLog);
      return; 
    }
    // 8. Make Request (Cache Miss)
    if (!exists) {
      const config = {
        method,
        url: redirectUrl,
        headers: {
          ...req.headers,
          host: parsed.hostname,
        },
        httpsAgent,
        timeout: 10000,
        validateStatus: () => true, // let non-200 responses pass through
      };

      if (method !== "GET" && req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
      }

      const timebeforeresponse = Date.now();
      const response = await axios(config);
      const timeafterresponse = Date.now();
      
      // Define finalTime for logging usage
      const finalTime = timeafterresponse;

      res.status(response.status).set(response.headers).send(response.data);
      // console.log("response received from user's api");
      const MakeRequestLog = {
        projectId,
        keyId: isApikey._id,
        route: urlpath,
        cached,
        method,
        origin,
        statusCode: response.status,
        latency: finalTime - initiationtime,
        user_api_latency: timeafterresponse - timebeforeresponse,
      };
      
      await createRequestLog(MakeRequestLog);

      // Redis cache 2xx responses
      // console.log("routeinfo for caching:", routeinfo);
      if (
        routeinfo.cacheEnabled &&
        response.status >= 200 &&
        response.status < 300
      ) {
        // Saved 'response.headers' instead of 'response.status' into the headers field
        const cachejsonstring = JSON.stringify({
          status: response.status,
          headers: response.headers, 
          data: response.data,
        });
        // console.log("caching response");
        const ttlInSeconds = routeinfo.cacheTTL;
        await redis.set(hashedkey, cachejsonstring, "EX", ttlInSeconds);
        const value=await redis.get(hashedkey);
        // console.log("caching response :", ttlInSeconds,"seconds");
        // console.log(value,hashedkey);
      }

      // console.log("time taken by user's api :", finalTime - timebeforeresponse);
    }

  } catch (err) {
    console.error("Gateway error:", err.message);
    // Ensure we don't try to send headers if they were already sent
    if (!res.headersSent) {
        res.status(502).json({
        error: "Bad Gateway — could not fetch target API",
        details: err.message,
        });
    }
  }
});

export { gatewayRouter };