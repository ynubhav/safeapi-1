import { Route } from "../models/Route.model.js";
import { Routes_cache } from "./routes-cache.js";

const create_routes_cache = async () => {
  try {
    const loadroutes = await Route.find({});
    for (let i = 0; i < loadroutes.length; i++) {
      const route = loadroutes[i];
      if (!Routes_cache[route.projectId]) {
        Routes_cache[route.projectId] = {};
      }
      if (!Routes_cache[route.projectId][route.method]) {
        Routes_cache[route.projectId][route.method] = [];
      }
      Routes_cache[route.projectId][route.method].push({
        path: route.path,
        authRequired: route.authRequired,
        cacheEnabled: route.cacheEnabled,
        cacheTTL: route.cacheTTL,
        description: route.description,
      });
    }
    Routes_cache.__meta = { updatedAt: Date.now() };
    console.log("✅ ROUTES CACHE CREATION SUCCCESSFULL");
  } catch (error) {
    console.log("ERROR CREATING ROUTES CACHE");
  }
};

export default create_routes_cache;
