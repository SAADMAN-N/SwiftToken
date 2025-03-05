import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';

const TREASURY_WALLET = new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS!);

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

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = buyerPublicKey;

  return transaction;
}

export async function confirmTransaction(
  connection: Connection,
  signature: string
): Promise<boolean> {
  const result = await connection.confirmTransaction(signature);
  return !result.value.err;
}
