import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { env } from '@/lib/env';

export class WalletService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(env.NEXT_PUBLIC_SOLANA_RPC_URL);
  }

  async getBalance(walletAddress: string): Promise<number> {
    try {
      const pubKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(pubKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      throw new Error('Failed to get wallet balance');
    }
  }

  async verifyTransaction(signature: string): Promise<boolean> {
    try {
      const transaction = await this.connection.getTransaction(signature);
      if (!transaction) return false;

      // Verify transaction details
      const { meta } = transaction;
      if (!meta) return false;

      // Check if transaction was successful
      if (meta.err) return false;

      // Verify recipient is merchant wallet
      const merchantWallet = new PublicKey(env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS);
      const postBalances = meta.postBalances;
      const preBalances = meta.preBalances;
      
      // Verify merchant received payment
      const merchantIndex = transaction.transaction.message.accountKeys.findIndex(
        key => key.equals(merchantWallet)
      );
      
      if (merchantIndex === -1) return false;
      
      const merchantBalanceChange = postBalances[merchantIndex] - preBalances[merchantIndex];
      return merchantBalanceChange > 0;
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      return false;
    }
  }
}

export const walletService = new WalletService();