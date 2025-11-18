import express from "express";
import { generateProjectId } from "../utils/generateProjectId.js";
import { generateApiKey } from "../utils/generateApiKey.js";
import { APIProject } from "../models/Project.model.js";
import authUser from "../middlewares/authUser.middleware.js";
import { User } from "../models/User.model.js";
import { Route } from "../models/Route.model.js";
import { normalizePath, hasCollision } from "../utils/routeMatch.js";

import {
  CreateManyRoutesCache,
  CreateRouteCache,
  deleteRouteCache,
  ProjectDeletion,
  UpdateRouteCache,
} from "../cache/update-route-cache.js";

const projectRouter = express.Router();

projectRouter.post("/", authUser, async (req, res) => {
  try {
    const { name, description, originUrl } = req.body;
    const userId = req.user._id;
    const projectId = generateProjectId(8);
    const proxyUrl = `${process.env.GATEWAY_URL}${projectId}/`;
    const apiKey = generateApiKey(userId, projectId); //used project id cause unique
    const name_allowed = await APIProject.find({ userId, name });
    if (name_allowed.length > 0) {
      return res.status(403).json({ message: "Name already taken" });
    }
    const createProject = await APIProject.create({
      userId,
      name,
      description,
      projectId,
      originUrl,
      proxyUrl,
      apiKey,
    });

    // add this project to the array for user
    const addProject = await User.findByIdAndUpdate(userId, {
      $push: { projects: createProject._id },
    });

    res.status(201).json({ message: "Project Created Succesfully", projectId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
}); // create project name ,description and baseUrl to create the proxyUrl and generate a apikey-fronow

projectRouter.get("/", authUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const UserProjectData = await User.findById(userId).populate(
      "projects",
      "name description projectId originUrl ProxyUrl"
    );
    // populate required things
    res.status(200).json({
      message: "Successfully fetched Projects",
      projects: UserProjectData.projects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

projectRouter.get("/:projectId", authUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const reqprojId = req.params.projectId;
    const UserProjectData = await User.findById(userId).populate(
      "projects",
      "name description projectId originUrl ProxyUrl"
    );
    //console.log(UserProjectData.projects)
    const Results = UserProjectData.projects.filter((projectinfo) => {
      console.log(projectinfo.projectId == reqprojId);
      return projectinfo.projectId == reqprojId;
    });
    if (Results.length == 1) {
      res
        .status(200)
        .json({ message: "Project Found", ProjectInfo: Results[0] });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
}); // get details of a project

projectRouter.put("/:projectId", authUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const { allowedOrigins, rateLimit, status } = req.body;
    const projectId = req.params.projectId;
    const UpdateProject = await APIProject.findOneAndUpdate(
      { projectId, userId },
      {
        allowedOrigins,
        rateLimit,
        status,
        updatedAt: Date.now(),
      }
    );
    res.status(202).json({ message: "APIProject Updated Just Now" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}); //update project settings and specifications
//

projectRouter.delete("/:projectId", authUser, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user._id;
    // verify by project
    const GetProject_id = await APIProject.findOne({ userId, projectId });
    const deleteProject = await APIProject.findOneAndDelete({
      userId,
      projectId,
    });
    const UserPrjRem = await User.findByIdAndUpdate(userId, {
      $pull: { projects: GetProject_id._id },
    });
    // remove from cache
    ProjectDeletion(projectId);

    res.status(200).json({ message: "Deletion Successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
}); // delete project

projectRouter.post("/:projectId/route", authUser, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { path, method, authRequired, cacheEnabled, cacheTTL, description } =
      req.body;
    const Data = req.body;
    const userId = req.user._id;
    // ensure project exists
    const project = await APIProject.find({ projectId, userId });
    if (project.length == 0)
      return res.status(404).json({ message: "Project not found" });

    // check if route already exists
    const existing = await Route.findOne({
      projectId,
      method: Data.method,
      path: Data.path,
    });
    if (existing)
      return res.status(400).json({ message: "Route already exists" });

    // create new route
    const newRoute = await Route.create({
      projectId,
      path,
      method,
      authRequired,
      cacheEnabled,
      cacheTTL,
      description,
    });
    // create route cache
    CreateRouteCache(newRoute, projectId);

    res.status(201).json({ message: "Route created successfully", newRoute });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
});

projectRouter.patch(
  "/:projectId/route/:routeId",
  authUser,
  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const routeId = req.params.routeId;
      const userId = req.user._id;
      const { authRequired, cacheEnabled, cacheTTL, description } = req.body;
      const projectfound = await APIProject.findOne({ projectId, userId });
      if (projectfound) {
        const InitialRoute = await Route.findOne({
          projectId,
          _id: routeId,
        });
        const updateRoute = await Route.findOneAndUpdate(
          {
            projectId,
            _id: routeId,
          },
          {
            authRequired,
            cacheEnabled,
            cacheTTL,
            description,
          },
          { new: true }
        );
        //update in cache
        UpdateRouteCache(projectId, InitialRoute, updateRoute);
        return res.status(200).json({ message: "Route updated" });
      } else {
        res.status(404).json({ message: "Project Not Found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error" });
    }
  }
);

projectRouter.delete(
  "/:projectId/route/:routeId",
  authUser,
  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const routeId = req.params.routeId;
      const userId = req.user._id;
      const projectfound = await APIProject.find({ projectId });
      if (projectfound.length == 1) {
        const foundRoute = await Route.findOne({
          projectId,
          _id: routeId,
        });
        const findRoute = await Route.findOneAndDelete({
          projectId,
          _id: routeId,
        });
        //delete from cache
        deleteRouteCache(projectId, foundRoute);

        return res.status(200).json({ message: "Route deleted" });
      } else {
        res.status(404).json({ message: "Project Not Found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error" });
    }
  }
);

// to get all routes in a project
projectRouter.get("/:projectId/routes", authUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.projectId;
    const projectfound = await APIProject.findOne({ userId, projectId });
    if (projectfound) {
      const Routes = await Route.find({ projectId });
      return res.status(200).json({ message: "Routes Found", Routes });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error" });
  }
});

//bulk registration for routes
projectRouter.post("/:projectId/bulk-routes", authUser, async (req, res) => {
  try {
    const { projectId } = req.params;
    const routes = req.body.routes; // array of { method, path, authRequired,cacheEnabled,cacheTTL,description }

    if (!Array.isArray(routes) || routes.length === 0) {
      return res.status(400).json({ error: "routes array required" });
    }

    // -----------------------------------------
    // 1. Internal Collision Check (incoming list)
    // -----------------------------------------
    const seen = {}; // map: method → normalizedPath → boolean

    for (const r of routes) {
      const method = r.method.toUpperCase();
      const normalized = normalizePath(r.path);

      if (!seen[method]) seen[method] = {};

      if (seen[method][normalized]) {
        return res.status(409).json({
          error: "Route collision inside payload",
          conflict: { method, path: r.path },
        });
      }

      seen[method][normalized] = true;
      r.normalizedPath = normalized; // add it for DB insert
    }

    // fetch existing routes of that project of same methods
    const methods = [...new Set(routes.map((r) => r.method))];

    const existing = await Route.find({
      projectId,
      method: { $in: methods },
    });

    const newRoutesToInsert = [];

    for (const route of routes) {
      if (!route.method || !route.path || !route.authRequired) {
        return res.status(400).json({ error: "Invalid route structure" });
      }

      // collision check
      const collision = hasCollision(existing, route);
      if (collision) {
        return res.status(409).json({
          error: `Collision detected for method ${route.method} & path '${route.path}'`,
        });
      }

      // push to insert list
      newRoutesToInsert.push({
        projectId,
        ...route,
      });
    }

    // Save all to DB
    const saved = await Route.insertMany(newRoutesToInsert);

    //update cache
    CreateManyRoutesCache(newRoutesToInsert, projectId);

    return res.status(201).json({
      message: "Routes registered successfully",
      count: saved.length,
      routes: saved,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export { projectRouter };
