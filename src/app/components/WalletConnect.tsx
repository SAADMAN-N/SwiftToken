'use client';

import dynamic from 'next/dynamic';
import { useSolanaBalance } from '@/hooks/useSolanaBalance';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';

const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function WalletConnect() {
  const { connected, publicKey } = useWallet();
  const { balance, isLoading: balanceLoading, error: balanceError } = useSolanaBalance();

  useEffect(() => {
    const createUser = async () => {
      if (connected && publicKey) {
        try {
          const response = await fetch('/api/users/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletAddress: publicKey.toString(),
            }),
          });
          
          if (!response.ok) {
            const data = await response.json();
            console.error('Failed to create user:', data.error);
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }
    };

    createUser();
  }, [connected, publicKey]);

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
              Balance: {balanceLoading ? '...' : balance}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
