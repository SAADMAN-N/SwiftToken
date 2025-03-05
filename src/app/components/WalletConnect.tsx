'use client';

import dynamic from 'next/dynamic';
import { useSolanaBalance } from '@/hooks/useSolanaBalance';
import { useWallet } from '@solana/wallet-adapter-react';

// Dynamically import WalletMultiButton with ssr disabled
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function WalletConnect() {
  const { connected, publicKey } = useWallet();
  const { balance, isLoading: balanceLoading, error: balanceError } = useSolanaBalance();

  return (
    <div className="flex flex-col gap-2">
      {balanceError && (
        <div className="text-sm text-red-500">
          {balanceError}
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <WalletMultiButton />

        {connected && publicKey && (
          <div className="text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </div>
            <div className="font-medium">
              {balanceLoading ? (
                <span className="text-gray-400">Loading...</span>
              ) : balance !== null ? (
                <span>{balance.toFixed(4)} SOL</span>
              ) : (
                <span className="text-red-500">Error</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
