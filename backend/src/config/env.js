import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => Number(val)).default('5000'),
  MONGO_URI: z.string({
    required_error: 'MONGO_URI is required',
  }).refine((val) => val.startsWith('mongodb://') || val.startsWith('mongodb+srv://'), {
    message: 'MONGO_URI must be a valid MongoDB connection string starting with mongodb:// or mongodb+srv://',
  }),
  ACCESS_TOKEN_SECRET: z.string({
    required_error: 'ACCESS_TOKEN_SECRET is required',
  }).min(16, 'ACCESS_TOKEN_SECRET must be at least 16 characters long'),
  REFRESH_TOKEN_SECRET: z.string({
    required_error: 'REFRESH_TOKEN_SECRET is required',
  }).min(16, 'REFRESH_TOKEN_SECRET must be at least 16 characters long'),
  ACCESS_TOKEN_EXPIRE: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRE: z.string().default('7d'),
  FRONTEND_URL: z.string({
    required_error: 'FRONTEND_URL is required',
  }).url('FRONTEND_URL must be a valid URL'),
  CLOUDINARY_NAME: z.string().optional().default('dev_cloudinary'),
  CLOUDINARY_API_KEY: z.string().optional().default('dev_api_key'),
  CLOUDINARY_SECRET: z.string().optional().default('dev_secret'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    result.error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  return result.data;
};

const env = parseEnv();

export default env;

