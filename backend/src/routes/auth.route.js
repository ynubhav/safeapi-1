import express from "express";
import { User } from "../models/User.model.js";
import { generateToken } from "../utils/createJWT.js";

const authRouter = express.Router();

//user register
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });
    res.json({ message: "User Registered", data: newUser });
  } catch (err) {
    res.status(500).json({ message: "Couldnot Register User" });
  }
});

authRouter.post("/admin_register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      usertype: "Admin",
    });
    res.json({ message: "Admin Registered", data: newUser });
  } catch (err) {
    res.status(500).json({ message: "Couldnot Register Admin" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const IsUserRegistered = await User.findOneAndUpdate(
      { email, password },
      { lastLogin: Date.now() }
    );
    if (IsUserRegistered) {
      const userId = IsUserRegistered._id;
      const token = generateToken(userId);
      res.status(200).json({
        message: "Login Succesfull",
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "User email/Password incorrect" });
  }
});

authRouter.get("/google_auth", (req, res) => {});
authRouter.get("/github_auth", (req, res) => {});
authRouter.post("/refresh", (req, res) => {});
authRouter.post("/logout", (req, res) => {});

export { authRouter };
