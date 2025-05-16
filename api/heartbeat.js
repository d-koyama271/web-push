import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async () => {
  await redis.ping();
  return new Response("pong", { status: 200 });
};
