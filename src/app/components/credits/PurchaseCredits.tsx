'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createCreditPurchaseTransaction, confirmTransaction } from '@/lib/solana/transactions';

const CREDIT_PACKAGES = [
  { credits: 1, price: 0.01 },
  { credits: 5, price: 0.05 },
  { credits: 10, price: 0.09 },
  { credits: 25, price: 0.20 },
] as const;

export function PurchaseCredits() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();

  const handlePurchase = async (credits: number, price: number) => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Creating transaction...');
      const transaction = await createCreditPurchaseTransaction(
        connection,
        publicKey,
        price
      );

      console.log('Sending transaction...');
      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction sent:', signature);

      console.log('Waiting for confirmation...');
      const confirmed = await confirmTransaction(connection, signature);
      
      if (!confirmed) {
        throw new Error('Transaction failed to confirm');
      }

      console.log('Transaction confirmed, updating credits...');
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature,
          walletAddress: publicKey.toString(),
          credits,
          solAmount: price
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to credit account');
      }

      // Refresh credits display
      window.location.reload();
    } catch (err) {
      console.error('Purchase error:', err);
      if (err instanceof Error && err.message.includes('Transaction was not confirmed')) {
        setError('Transaction taking longer than expected. Please check your wallet or Solana Explorer for confirmation.');
      } else {
        setError(err instanceof Error ? err.message : 'Purchase failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Please connect your wallet to purchase credits
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Purchase Credits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CREDIT_PACKAGES.map(({ credits, price }) => (
          <button
            key={credits}
            onClick={() => handlePurchase(credits, price)}
            disabled={loading}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${loading 
                ? 'bg-gray-700 dark:bg-gray-800 border-gray-600 cursor-not-allowed' 
                : 'bg-gray-800 dark:bg-gray-900 border-blue-500 hover:bg-gray-700'}
              text-white
            `}
          >
            <div className="text-2xl mb-2">🪙 {credits}</div>
            <div className="text-sm text-gray-300">
              {price} SOL
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {(price / credits).toFixed(3)} SOL per credit
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-blue-500 text-sm mt-2">
          Processing transaction...
        </div>
      )}
    </div>
  );
}
