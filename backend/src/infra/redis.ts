import { Redis } from "ioredis";

import { env } from "../config/env.js";

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
});

redis.on("connect", () => {
  console.log("Redis conectado com sucesso!");
});

redis.on("error", (error) => {
  console.error("Erro na conexão com Redis:", error);
});

export async function connectRedis() {
  await redis.connect();
}
