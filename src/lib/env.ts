import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  REPLICATE_API_TOKEN: z.string().min(1),
  MERCHANT_WALLET_ADDRESS: z.string().min(1),
  SOLANA_NETWORK: z.enum(['devnet', 'mainnet']),
  NEXT_PUBLIC_FREE_GENERATIONS_PER_USER: z.string().transform(Number),
  NEXT_PUBLIC_PAID_PRICE_SOL: z.string().transform(Number),
  NEXT_PUBLIC_BULK_PRICE_SOL: z.string().transform(Number),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  // New API keys validation
  NEWS_API_KEY: z.string().min(1),
  TWITTER_API_KEY: z.string().min(1),
  TWITTER_API_SECRET: z.string().min(1),
  TWITTER_BEARER_TOKEN: z.string().min(1),
  TWITTER_ACCESS_TOKEN: z.string().min(1),
  TWITTER_ACCESS_TOKEN_SECRET: z.string().min(1),
});

export function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return { success: true, data: parsed };
  } catch (error) {
    console.error('Environment validation failed:', error);
    return { success: false, error };
  }
}
