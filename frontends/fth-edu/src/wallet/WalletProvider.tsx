import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface Wallet {
  address: string;
  chain: 'solana' | 'xrpl' | 'stellar';
  label: string;
}

interface WalletContextType {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  addWallet: (wallet: Wallet) => void;
  setActiveWallet: (wallet: Wallet) => void;
  removeWallet: (address: string) => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType>({
  wallets: [],
  activeWallet: null,
  addWallet: () => {},
  setActiveWallet: () => {},
  removeWallet: () => {},
  isLoading: true,
});

export const useWallet = () => useContext(WalletContext);

const STORAGE_KEY = 'troptions_wallets';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [activeWallet, setActiveWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWallets();
  }, []);

  async function loadWallets() {
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setWallets(parsed);
        if (parsed.length > 0) setActiveWallet(parsed[0]);
      }
    } catch (err) {
      console.warn('Wallet load error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveWallets(newWallets: Wallet[]) {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(newWallets));
  }

  const addWallet = async (wallet: Wallet) => {
    const updated = [...wallets, wallet];
    setWallets(updated);
    if (!activeWallet) setActiveWallet(wallet);
    await saveWallets(updated);
  };

  const removeWallet = async (address: string) => {
    const updated = wallets.filter(w => w.address !== address);
    setWallets(updated);
    if (activeWallet?.address === address) {
      setActiveWallet(updated[0] || null);
    }
    await saveWallets(updated);
  };

  return (
    <WalletContext.Provider value={{ wallets, activeWallet, addWallet, setActiveWallet, removeWallet, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
}
