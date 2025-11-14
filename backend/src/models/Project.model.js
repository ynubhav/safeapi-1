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
  
  // Rate limiting settings
  rateLimit: { type: Number, min: 1, max: 100, default: 100 }, // requests per minute

  status: { type: String, enum: ["active", "suspended"], default: "suspended" },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

const APIProject = mongoose.model("APIProject", APIProjectSchema);

export { APIProject };
