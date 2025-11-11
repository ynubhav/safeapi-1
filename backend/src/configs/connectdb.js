import mongoose from "mongoose";
import { config } from "dotenv"

config();

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STR);
    console.log("connect to database");
  } catch (err) {
    console.log("could not establish a connection");
  }
};

export { connectdb }