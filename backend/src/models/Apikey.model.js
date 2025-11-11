import mongoose from "mongoose";

const APIKeySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "APIProject", required: true },
  key: { type: String, required: true, unique: true },
  label: { type: String }, // e.g. "Production", "Testing"

  lastUsed: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const APIKey = mongoose.model("APIKey", APIKeySchema);

export { APIKey }