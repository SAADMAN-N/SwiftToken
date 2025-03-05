import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionSignature
} from '@solana/web3.js';

export async function sendSolana(
  connection: Connection,
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  amount: number, // in SOL
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<{ signature: TransactionSignature; error?: never } | { signature?: never; error: string }> {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Sign the transaction
    const signed = await signTransaction(transaction);

    // Send the transaction
    const signature = await connection.sendRawTransaction(signed.serialize());

    // Confirm transaction
    await connection.confirmTransaction(signature);

    return { signature };
  } catch (err: any) {
    console.error('Transaction error:', err);
    return { error: err.message || 'Failed to send transaction' };
  }
}