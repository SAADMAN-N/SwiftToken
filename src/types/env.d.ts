declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      REPLICATE_API_TOKEN: string;
      MERCHANT_WALLET_ADDRESS: string;
      SOLANA_NETWORK: 'devnet' | 'mainnet';
      NEXT_PUBLIC_FREE_GENERATIONS_PER_USER: string;
      NEXT_PUBLIC_PAID_PRICE_SOL: string;
      NEXT_PUBLIC_BULK_PRICE_SOL: string;
      NEXT_PUBLIC_APP_URL: string;
    }
  }
}

export {}
