'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const useSolanaBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (err: any) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance');
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    
    // Only set up the listener if we have a publicKey
    if (publicKey) {
      // Set up balance change listener
      const subscriptionId = connection.onAccountChange(
        publicKey,
        () => {
          fetchBalance();
        },
        'confirmed'
      );

      return () => {
        connection.removeAccountChangeListener(subscriptionId);
      };
    }
  }, [publicKey, connection]);

  return { balance, isLoading, error, refetch: fetchBalance };
};
