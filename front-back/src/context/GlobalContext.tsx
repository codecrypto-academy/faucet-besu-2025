"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GlobalContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const GlobalContext = createContext<GlobalContextType>({
  account: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export function useGlobal() {
  return useContext(GlobalContext);
}

interface GlobalProviderProps {
  children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
      }
    } else {
      console.error('Please install MetaMask');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  useEffect(() => {
    // Handle account changes
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ account, connectWallet, disconnectWallet }}>
      {children}
    </GlobalContext.Provider>
  );
}
