import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  REPLICATE_API_TOKEN: z.string().min(1),
  MERCHANT_WALLET_ADDRESS: z.string().min(1),
  SOLANA_NETWORK: z.enum(['devnet', 'mainnet']),
  NEXT_PUBLIC_FREE_GENERATIONS_PER_USER: z.string().transform(Number),
  NEXT_PUBLIC_PAID_PRICE_SOL: z.string().transform(Number),
  NEXT_PUBLIC_BULK_PRICE_SOL: z.string().transform(Number),
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