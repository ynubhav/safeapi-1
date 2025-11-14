import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
  projectId: { type:String,required: true },
  path: { type: String, required: true }, // e.g., /status/:id/items
  method: { type: String, enum: ["GET", "POST", "PUT", "DELETE","PATCH"], required: true },

  // Controls
  authRequired: { type: Boolean, default: true },
  cacheEnabled: { type: Boolean, default: false },
  cacheTTL: { type: Number, default: 60 }, // in seconds

  description: { type: String ,default:""},
});
const Route=mongoose.model("Route", RouteSchema);

export { Route }
