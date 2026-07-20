import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:5000/api/v1'),
  VITE_FIREBASE_API_KEY: z.string().default(''),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().default(''),
  VITE_FIREBASE_PROJECT_ID: z.string().default(''),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().default(''),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().default(''),
  VITE_FIREBASE_APP_ID: z.string().default(''),
  VITE_DEMO_EMAIL: z.string().email().default('demo@mealmind.local'),
  VITE_DEMO_PASSWORD: z.string().min(8).default('change-this-demo-password'),
});

export const env = envSchema.parse(import.meta.env);

export const isFirebaseConfigured = [
  env.VITE_FIREBASE_API_KEY,
  env.VITE_FIREBASE_AUTH_DOMAIN,
  env.VITE_FIREBASE_PROJECT_ID,
  env.VITE_FIREBASE_APP_ID,
].every((value) => value.length > 0);
