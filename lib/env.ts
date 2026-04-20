import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(16),
  NEXTAUTH_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().min(20),
  OPENAI_MODEL_FAST: z.string().default("gpt-4.1-mini"),
  OPENAI_MODEL_PRO: z.string().default("gpt-4.1"),
});

export const env = envSchema.parse(process.env);
