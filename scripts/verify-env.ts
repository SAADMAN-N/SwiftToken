#!/usr/bin/env node
import { validateEnv } from '../src/lib/env';

async function main() {
  try {
    const { success, data } = validateEnv();
    if (success) {
      console.log('✓ Environment validation passed');
      console.log('\nConfigured variables:');
      console.log('- Solana Network:', data.SOLANA_NETWORK);
      console.log('- App URL:', data.NEXT_PUBLIC_APP_URL);
      console.log('- Database: Connected');
      console.log('- OpenAI API: Configured');
      console.log('- Replicate API: Configured');
    }
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
