import mongoose from "mongoose";

const RequestLogSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "APIProject", required: true },

  route: { type: String, required: true }, // route ex : project/:id/...
  method: { type: String, required: true },
  origin: { type: String },

  statusCode: { type: Number },
  latency: { type: Number }, // in ms
  cached: { type: Boolean, default: false },

  timestamp: { type: Date, default: Date.now },
});

const RequestLog= mongoose.model("RequestLog", RequestLogSchema);

export {  RequestLog };