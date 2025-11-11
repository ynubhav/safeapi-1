// import express from "express";
// import axios from "axios";
// import { APIProject } from "../models/Project.model.js";
// import https from "https";

// const agent = new https.Agent({
//   rejectUnauthorized: false,
// });

// const gatewayRouter = express.Router();

// gatewayRouter.use("/:projectId", async (req, res) => {
//   // const api_route=req.url;//with queries
//   // const base_api_route=api_route.split('?')[0];
//   // const origin=req.get('origin');
//   // const apiKey=req.get('x-safeapi-key');

//   // res.json({original_route:req.ip+" "+req.method+" "+req.host+" "+req.url,
//   //     base_api_route,
//   //     origin:'hello'+origin,
//   //     apiKey
//   // })
//   // req.host

//   const projectId = req.params.projectId;

//   const Project = await APIProject.findOne({ projectId });
//   const method = req.method;
//   const originUrl = Project.originUrl;
//   const apiKey = req.get("x-safeapi-key");
//   const redirect_url = `${originUrl}${req.url}`;
//   console.log(redirect_url)
//   const config = {
//     method,
//     url: redirect_url,
//     headers: { ...req.headers },
//     httpsAgent: agent,
//   };
//   if (method.toUpperCase() != "GET") {
//     config.data = req.body;
//   }
//   try {
//     const response = await axios(config);
//     res.status(response.status).set(response.headers).send(response.data);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: err.message+'lol' });
//   }
// });

// export { gatewayRouter };

// /*
// steps in process of gateway

// 1. check if projectId active and valid
// 2. authourise the api : apikey, request origin,
// 3. send request to the user's api
// 4. get the result and return as it is
// 5. if request cachable set the pair in redis
// 6. create api log

// */

import express from "express";
import axios from "axios";
import https from "https";
import dns from "dns";
import { APIProject } from "../models/Project.model.js";

const gatewayRouter = express.Router();

// 🧠 agent to ignore SSL issues (only temporary for dev)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

gatewayRouter.use("/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const method = req.method.toUpperCase();
  const apiKey = req.get("x-safeapi-key");
  const origin = req.get("origin");

  try {
    // 1️⃣ validate project
    const project = await APIProject.findOne({ projectId }).select(
      "apiKey originUrl"
    );
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    console.log(1);
    // 2️⃣ authorize
    if (project.apiKey != apiKey) {
      return res.status(403).json({ error: "Invalid API key" });
    }
    console.log(2);
    // optional: restrict who can call the gateway
    if (origin && project.originUrl && !origin.startsWith(project.originUrl)) {
      return res.status(403).json({ error: "Unauthorized origin" });
    }
    console.log(3);
    // 3️⃣ prepare redirect target
    const redirectUrl = `${project.originUrl}${req.url}`;
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
    // 4️⃣ build axios config
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
    // 5️⃣ send request
    const response = await axios(config);
    console.log(8);
    // 6️⃣ forward response
    res.status(response.status).set(response.headers).send(response.data);

    // 🪵 future steps:
    // - log the request in Mongo
    // - store cache in Redis if cacheable
    // - increment usage counter
  } catch (err) {
    console.error("Gateway error:", err.message);
    res.status(502).json({
      error: "Bad Gateway — could not fetch target API",
      details: err.message,
    });
  }
});

export { gatewayRouter };
