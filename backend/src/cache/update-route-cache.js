import { Routes_cache } from "./routes-cache.js";

const CreateManyRoutesCache = (newRoutesToInsert, projectId) => {
  for (let i = 0; i < newRoutesToInsert.length; i++) {
    if (!Routes_cache[projectId]) {
      Routes_cache[projectId] = {};
    }

    if (!Routes_cache[projectId][newRoutesToInsert[i].method]) {
      Routes_cache[projectId][newRoutesToInsert[i].method] = [];
    }

    Routes_cache[projectId][newRoutesToInsert[i].method].push(
      newRoutesToInsert[i].path
    );
  }
  Routes_cache.__meta = { updatedAt: Date.now() };
  console.log("ROUTE CACHE UPDATED");
};

const CreateRouteCache = (newRoute, projectId) => {
  if (!Routes_cache[projectId]) {
    Routes_cache[projectId] = {};
  }

  if (!Routes_cache[projectId][newRoute.method]) {
    Routes_cache[projectId][newRoute.method] = [];
  }

  Routes_cache[projectId][newRoute.method].push(newRoute.path);

  Routes_cache.__meta = { updatedAt: Date.now() };
  console.log("ROUTE CACHE UPDATED");
};

const UpdateRouteCache = (projectId, InitialRoute, UpdateRoute) => {
  if (
    !Routes_cache[projectId] ||
    !Routes_cache[projectId][InitialRoute.method]
  ) {
    throw new Error("Route Was not Found to be registered before hand1");
  }

  const arr = Routes_cache[projectId][InitialRoute.method];

  //find and change the route info

  let updated = false;
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    const b = {
      path: InitialRoute.path,
      authRequired: InitialRoute.authRequired,
      cacheEnabled: InitialRoute.cacheEnabled,
      cacheTTL: InitialRoute.cacheTTL,
      description: InitialRoute.description,
    };
    if (JSON.stringify(a) === JSON.stringify(b)) {
      arr[i] = {
        path: UpdateRoute.path,
        authRequired: UpdateRoute.authRequired,
        cacheEnabled: UpdateRoute.cacheEnabled,
        cacheTTL: UpdateRoute.cacheTTL,
        description: UpdateRoute.description,
      };
      Routes_cache.__meta = { updatedAt: Date.now() };
      updated = true;
      break;
    }
  }

  if (!updated) {
    throw new Error("Route Was not Found to be registered before hand");
  } else {
    console.log("Updated Route Cache");
  }
};

const deleteRouteCache = (projectId, Route) => {
  if (!Routes_cache[projectId] || !Routes_cache[projectId][newRoute.method]) {
    throw new Error("Route Was not Found to be registered before hand");
  }

  const initiallen = Routes_cache[projectId][Route.method].length;

  const arr = Routes_cache[projectId][Route.method].filter((route) => {
    return !JSON.stringify(route) === JSON.stringify(Route);
  });
  const finallen = arr.length;
  Routes_cache[projectId][Route.method] = [...arr];

  if (!(initiallen - 1 == finallen)) {
    throw new Error("Route Not Found Deleted");
  }
  Routes_cache.__meta = { updatedAt: Date.now() };
  console.log("ROUTE CACHE ROUTE DELETED");
};

const ProjectDeletion = (projectId) => {
  if (Routes_cache[projectId]) {
    delete Routes_cache[projectId];
  }
  Routes_cache.__meta = { updatedAt: Date.now() };
  console.log("Project Removed from ROUTE CACHE");
};

export {
  CreateManyRoutesCache,
  CreateRouteCache,
  UpdateRouteCache,
  deleteRouteCache,
  ProjectDeletion,
};
