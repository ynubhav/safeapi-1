import mongoose from "mongoose";

const APIProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: { type: String, required: true },
  description: { type: String },
  projectId: { type: String, required: true, select: false },
  // Original backend server URL (user’s API)
  originUrl: { type: String, required: true },

  // Generated SafeAPI Gateway URL
  proxyUrl: { type: String, required: true },

  // Project-specific API key
  apiKey: { type: String, required: true, select: false },

  // Security controls
  allowedOrigins: [{ type: String }], // whitelisted client domains
  publicRoutes: [{ type: String }], // open endpoints (no auth) // so that we know if to cache or not
  privateRoutes: [{ type: String }], // require API key && auth

  // Rate limiting settings
  rateLimit: { type: Number, min: 1, max: 100, default: 100 }, // requests per minute

  status: { type: String, enum: ["active", "suspended"], default: "suspended" },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

const APIProject = mongoose.model("APIProject", APIProjectSchema);

export { APIProject };
