import express from "express";
import axios from "axios";
import https from "https";
import dns from "dns";
import { APIProject } from "../models/Project.model.js";
import { APIKey } from "../models/Apikey.model.js";
import { RequestLog } from "../models/Apilogs.model.js";
import { Route } from "../models/Route.model.js";
import { matchRoute } from "../utils/pathMatcher.js";
import { Routes_cache } from "../cache/routes-cache.js";

const gatewayRouter = express.Router();

// agent to ignore SSL issues (only temporary for dev)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

gatewayRouter.use("/:projectId", async (req, res) => {
  const initTime = Date.now();
  const { projectId } = req.params;
  const method = req.method.toUpperCase();
  const apiKey = req.get("x-safeapi-key");
  const origin = req.get("origin");
  const urlwithquery = req.url;
  const incommingurl = urlwithquery.split("?")[0];
  const initTime0 = Date.now();
  console.log(incommingurl, urlwithquery);
  try {
    // validate project
    const project = await APIProject.findOne({ projectId }).select(
      "originUrl status allowedOrigins"
    );// bottle neck 1
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // check if origin allowed
    if (origin != undefined && !project.allowedOrigins.includes(origin)) {
      return res.status(503).json({ message: "origin not allowed" });
    }

    console.log(1);
    const initTime1 = Date.now();
    // authorize
    const isApikey = await APIKey.findOneAndUpdate(
      { projectId, key: apiKey, keystatus: "active" },
      { lastUsed: Date.now() }
    );// bottle neck 2
    if (!isApikey) {
      return res.status(403).json({ message: "Invalid/Disabled Apikey" });
    }

    console.log(2);
    //match and check if route valid and return the path
    const initTime2 = Date.now();
    let isvalidRoute = false;
    let urlpath = "";

    // const initialCheck = await Route.findOne({
    //   method,
    //   path: incommingurl,
    //   projectId,
    // });

    const initTime3 = Date.now();
    // if (!initialCheck) {
    //   const allroutes = await Route.find({ method, projectId });

    //   for (let i = 0; i < allroutes.length; i++) {
    //     if (matchRoute(allroutes[i].path, incommingurl).matched) {
    //       urlpath = allroutes[i].path;
    //       isvalidRoute = true;
    //       break;
    //     }
    //   }
    // } else {
    //   isvalidRoute = true;
    //   urlpath = initialCheck.path;
    // }


    const pathsarray = Routes_cache[projectId][method];
    //console.log(pathsarray);
    if (pathsarray.length==0) {
      return res.status(404).json({ message: "Invalid Route/ProjectId" });
    }

    for (let i = 0; i < pathsarray.length; i++) {
      if (matchRoute(pathsarray[i].path, incommingurl).matched) {
        urlpath = pathsarray[i].path;
        isvalidRoute = true;
        console.log('hello12345')
        break;
      }
    }

    if (!isvalidRoute) {
      return res.status(404).json({ message: "Invalid Route" });
    }
    const initTime4 = Date.now();
    // console.log(RouteInfo);

    console.log(3);
    // redirect only if active status
    if (project.status === "suspended") {
      return res.status(503).json({ message: "API Status : Suspended" });
    }
    // prepare redirect target
    const redirectUrl = `${project.originUrl}${urlwithquery}`;
    const initTime5 = Date.now();
    console.log(redirectUrl);
    const parsed = new URL(redirectUrl);
    if (parsed.protocol !== "https:") {
      return res.status(400).json({ error: "Only HTTPS URLs allowed" });
    }
    console.log(4);
    // optional: DNS check to avoid SSRF
    await new Promise((resolve, reject) => {
      dns.lookup(parsed.hostname, (err, addr) => {
        if (err || !addr) reject("DNS lookup failed");
        else resolve();
      });
    });
    console.log(5);
    const initTime6 = Date.now();
    // build axios config
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
    console.log(6);
    if (method !== "GET" && req.body && Object.keys(req.body).length > 0) {
      config.data = req.body;
    }
    console.log(7);
    // send request
    const timeb4req = Date.now();
    const response = await axios(config);
    console.log(8);
    // forward response

    res.status(response.status).set(response.headers).send(response.data);
    const finalTime = Date.now();
    //console.log(9);
    console.log("time taken by user's api :", finalTime - timeb4req);
    console.log(
      initTime0 - initTime,
      initTime1 - initTime,
      initTime2 - initTime1,
      initTime3 - initTime2,
      initTime4 - initTime3,
      initTime5 - initTime4,
      initTime6 - initTime5,
      timeb4req - initTime6
    );
    // 🪵 future steps:
    // - log the request in Mongo
    const MakeRequestLog = await RequestLog.create({
      projectId,
      keyId: isApikey._id,
      route: urlpath,
      method,
      origin,
      statusCode: response.status,
      latency: finalTime - initTime,
      user_api_latency: finalTime - timeb4req,
    });
    // - store cache in Redis if cacheable
    // - increment usage counter
    // console.log(MakeRequestLog);
  } catch (err) {
    console.error("Gateway error:", err.message);
    res.status(502).json({
      error: "Bad Gateway — could not fetch target API",
      details: err.message,
    });
  }
});

export { gatewayRouter };
