import Redis from "ioredis";

export const redis = new Redis({
  url: "redis-stack://localhost:6379",
});

// Optional: log connection success
redis.on("connect", () => {
  console.log("✅ Redis connected");
});

// Required: handle errors cleanly
redis.on("error", (err) => {
  console.error("REDIS ERROR ", err.message);
});