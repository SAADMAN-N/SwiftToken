'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';

interface PhantomWindow extends Window {
  solana?: {
    isPhantom?: boolean;
    connect: () => Promise<{ publicKey: PublicKey }>;
    disconnect: () => Promise<void>;
    signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
    publicKey: PublicKey | null;
    connected: boolean;
  };
}

export const usePhantomWallet = () => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  const getProvider = useCallback(() => {
    if (typeof window !== 'undefined' && 'solana' in window) {
      const win = window as PhantomWindow;
      const provider = win.solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    return null;
  }, []);

  const connect = async () => {
    try {
      setIsLoading(true);
      const provider = getProvider();
      if (provider) {
        const response = await provider.connect();
        setPublicKey(response.publicKey);
        setConnected(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      const provider = getProvider();
      if (provider) {
        await provider.disconnect();
        setPublicKey(null);
        setConnected(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    }
  };

  const sendTransaction = async (transaction: Transaction) => {
    const provider = getProvider();
    if (!provider) throw new Error('Phantom wallet not found');
    
    const { signature } = await provider.signAndSendTransaction(transaction);
    return signature;
  };

  useEffect(() => {
    const checkProvider = () => {
      const provider = getProvider();
      setIsPhantomInstalled(!!provider);
      if (provider) {
        setConnected(provider.connected);
        setPublicKey(provider.publicKey);
      }
    };

    checkProvider();
  }, [getProvider]);

  return {
    isPhantomInstalled,
    connected,
    connect,
    disconnect,
    error,
    isLoading,
    publicKey,
    sendTransaction
  };
};
