import { z } from 'zod';

const envSchema = z.object({
  // AI Services
  OPENAI_API_KEY: z.string().min(1),
  REPLICATE_API_TOKEN: z.string().min(1),
  
  // Solana Configuration
  NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS: z.string().min(1),
  SOLANA_NETWORK: z.enum(['devnet', 'mainnet-beta']),
  NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url(),
  
  // App Configuration
  NEXT_PUBLIC_FREE_GENERATIONS_PER_USER: z.string().transform(Number),
  NEXT_PUBLIC_PAID_PRICE_SOL: z.string().transform(Number),
  NEXT_PUBLIC_BULK_PRICE_SOL: z.string().transform(Number),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  
  // Payment Processing
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  
  // Social Media APIs (Optional)
  TWITTER_API_KEY: z.string().optional(),
  TWITTER_API_SECRET: z.string().optional(),
  TWITTER_BEARER_TOKEN: z.string().optional(),
  TWITTER_ACCESS_TOKEN: z.string().optional(),
  TWITTER_ACCESS_TOKEN_SECRET: z.string().optional(),
  
  // Database
  DATABASE_URL: z.string().min(1)
});

export function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return { success: true, data: parsed };
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
}

// Cast the process.env to unknown first to satisfy TypeScript
export const env = envSchema.parse(process.env as unknown) as z.infer<typeof envSchema>;
