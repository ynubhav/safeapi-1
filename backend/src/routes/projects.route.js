import express from "express";
import { generateProjectId } from "../utils/generateProjectId.js";
import { generateApiKey } from "../utils/generateApiKey.js";
import { APIProject } from "../models/Project.model.js";
import authUser from "../middlewares/authUser.middleware.js";
import { User } from "../models/User.model.js";

const projectRouter = express.Router();

projectRouter.post("/", authUser, async (req, res) => {
  try {
    const { name, description, originUrl } = req.body;
    const userId = req.user._id;
    const projectId = generateProjectId(8);
    const proxyUrl = `${process.env.GATEWAY_URL}${projectId}/`;
    const apiKey = generateApiKey(userId, projectId); //used project id cause unique

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
    const { allowedOrigins, publicRoutes, privateRoutes, rateLimit, status } =
      req.body;
    const projectId = req.params.projectId;
    const UpdateProject = await APIProject.findOneAndUpdate(
      { projectId, userId },
      {
        allowedOrigins,
        publicRoutes,
        privateRoutes,
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
    res.status(200).json({ message: "Deletion Successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
}); // delete project


// a route to update/create/delete route info of a project 

projectRouter

export { projectRouter };
