import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { env } from '@/lib/env';

export class WalletService {
  private connection: Connection;
  private treasuryWallet: PublicKey;

  constructor() {
    this.connection = new Connection(env.NEXT_PUBLIC_SOLANA_RPC_URL);
    this.treasuryWallet = new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS!);
  }

  async verifyTransaction(signature: string): Promise<boolean> {
    try {
      // Wait for transaction confirmation first
      console.log('Waiting for transaction confirmation...');
      await this.connection.confirmTransaction(signature);
      
      console.log('Getting transaction details...');
      const transaction = await this.connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed'
      });
      
      if (!transaction) {
        console.error('Transaction not found after confirmation');
        return false;
      }

      // Verify transaction details
      const { meta } = transaction;
      if (!meta) {
        console.error('Transaction metadata not found');
        return false;
      }

      // Check if the transaction was successful
      if (meta.err) {
        console.error('Transaction failed', meta.err);
        return false;
      }

      // Log the transaction details for debugging
      const accountKeys = transaction.transaction.message.getAccountKeys();
      const recipientAddress = accountKeys.get(1)?.toString();
      const expectedAddress = this.treasuryWallet.toString();
      const amount = (meta.postBalances[1] - meta.preBalances[1]) / LAMPORTS_PER_SOL;

      console.log('Transaction details:', {
        signature,
        recipient: recipientAddress,
        expectedRecipient: expectedAddress,
        amount
      });

      // Verify the recipient
      if (recipientAddress !== expectedAddress) {
        console.error('Invalid recipient');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      return false;
    }
  }
}

export const walletService = new WalletService();
