const { z } = require('zod');
const dotenv = require('dotenv');

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8080),
  DEMO_MODE: z.coerce.boolean().default(false),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(8),
  FX_API_BASE: z.string().url().default('https://api.exchangerate.host'),
  TELEPORT_API_BASE: z.string().url().default('https://api.teleport.org/api'),
  STRIPE_SECRET: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  MP_ACCESS_TOKEN: z.string().optional(),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:19006'),
  PUBLIC_API_BASE: z.string().url().default('http://localhost:8080'),
  DEFAULT_BUFFER_PERCENT: z.coerce.number().default(15),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format());
  process.exit(1);
}

module.exports = {
  env: _env.data,
};
