import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(3333),

  MONGODB_URI: z.url(),

  REDIS_URL: z.url(),

  SUPABASE_URL: z.url(),

  SUPABASE_ANON_KEY: z.string().min(1),

  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
