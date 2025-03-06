import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  Commitment,
  TransactionSignature
} from '@solana/web3.js';

const TREASURY_WALLET = new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS!);

export async function confirmTransaction(
  connection: Connection,
  signature: TransactionSignature,
  commitment: Commitment = 'confirmed'
): Promise<boolean> {
  try {
    const result = await connection.getSignatureStatus(signature, {
      searchTransactionHistory: true,
    });

    if (!result?.value) {
      return false;
    }

    if (result.value.err) {
      throw new Error(`Transaction failed: ${result.value.err.toString()}`);
    }

    // Check if the transaction has reached the desired commitment level
    const confirmations = result.value.confirmations;
    if (confirmations === null || confirmations === undefined) {
      // If confirmations is null, the transaction has been finalized
      return commitment === 'finalized';
    }

    // For other commitment levels, check if we have enough confirmations
    switch (commitment) {
      case 'finalized':
        return confirmations > 32;
      case 'confirmed':
        return confirmations > 1;
      case 'processed':
        return confirmations > 0;
      default:
        return false;
    }
  } catch (error) {
    console.error('Error confirming transaction:', error);
    return false;
  }
}

export async function waitForTransaction(
  connection: Connection,
  signature: TransactionSignature,
  commitment: Commitment = 'confirmed',
  timeout: number = 30000
): Promise<boolean> {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    const confirmed = await confirmTransaction(connection, signature, commitment);
    if (confirmed) {
      return true;
    }
    
    // Wait for 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error(`Transaction confirmation timeout after ${timeout}ms`);
}

export async function createCreditPurchaseTransaction(
  connection: Connection,
  buyerPublicKey: PublicKey,
  solAmount: number
): Promise<Transaction> {
  const transaction = new Transaction();

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: buyerPublicKey,
      toPubkey: TREASURY_WALLET,
      lamports: solAmount * LAMPORTS_PER_SOL
    })
  );

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = buyerPublicKey;

  return transaction;
}
