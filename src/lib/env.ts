import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  REPLICATE_API_TOKEN: z.string().min(1),
  NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS: z.string().min(1),
  SOLANA_NETWORK: z.enum(['devnet', 'mainnet-beta']),
  NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url(),
  NEXT_PUBLIC_FREE_GENERATIONS_PER_USER: z.string().transform(Number),
  NEXT_PUBLIC_PAID_PRICE_SOL: z.string().transform(Number),
  NEXT_PUBLIC_BULK_PRICE_SOL: z.string().transform(Number),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1)
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

// Call this in your app initialization
validateEnv();

export const env = process.env as z.infer<typeof envSchema>;
