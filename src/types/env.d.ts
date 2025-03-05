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
      // New API keys
      NEWS_API_KEY: string;
      TWITTER_API_KEY: string;
      TWITTER_API_SECRET: string;
      TWITTER_BEARER_TOKEN: string;
      TWITTER_ACCESS_TOKEN: string;
      TWITTER_ACCESS_TOKEN_SECRET: string;
    }
  }
}

export {}
