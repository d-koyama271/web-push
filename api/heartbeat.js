import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async (req, res) => {
  try {
    await redis.ping({ timeout: 3000 });
    res.status(200).end('pong');
  } catch (e) {
    console.error(e);
    res.status(500).end('err');
  }
};
