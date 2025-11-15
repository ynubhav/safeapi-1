import mongoose from "mongoose";

const RequestLogSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  keyId: { type: mongoose.Schema.Types.ObjectId, ref: "APIKey" },
  route: { type: String, required: true }, // route ex : project/:id/...
  method: { type: String, required: true },
  origin: { type: String },

  statusCode: { type: Number },
  user_api_latency: { type: Number },
  latency: { type: Number }, // in ms
  cached: { type: Boolean, default: false },

  timestamp: { type: Date, default: Date.now },
});

const RequestLog = mongoose.model("RequestLog", RequestLogSchema);

export { RequestLog };
