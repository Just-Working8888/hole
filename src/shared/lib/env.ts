import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
});
