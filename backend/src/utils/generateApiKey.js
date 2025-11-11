import crypto from "crypto";

function generateApiKey(userId, projectName) {
  const base = `${userId}_${projectName}_${crypto.randomUUID()}`;
  return crypto.createHash("sha256").update(base).digest("hex");
}

export { generateApiKey };
