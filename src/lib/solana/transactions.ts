import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  Commitment
} from '@solana/web3.js';

const TREASURY_WALLET = new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS!);

export async function confirmTransaction(
  connection: Connection,
  signature: string,
  commitment: Commitment = 'confirmed',
  maxRetries = 3,
  timeoutSeconds = 60
): Promise<boolean> {
  const startTime = Date.now();
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const result = await connection.confirmTransaction(
        signature,
        commitment,
        { maxSupportedTransactionVersion: 0 }
      );

      if (!result.value.err) {
        return true;
      }

      if (Date.now() - startTime > timeoutSeconds * 1000) {
        console.log('Transaction confirmation timeout');
        return false;
      }

      retries++;
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between retries
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      
      if (Date.now() - startTime > timeoutSeconds * 1000) {
        console.log('Transaction confirmation timeout');
        return false;
      }

      retries++;
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  return false;
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
