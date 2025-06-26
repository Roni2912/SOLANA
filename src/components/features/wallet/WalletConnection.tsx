import React from 'react';
import { Wallet } from 'lucide-react';
import { useApp } from '../../../contexts';
import { useWalletOperations } from '../../../hooks';
import { Button } from '../../ui';

interface WalletConnectionProps {
  children: React.ReactNode;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ children }) => {
  const { state } = useApp();
  const { connectWallet } = useWalletOperations();

  if (state.wallet) return null;

  return (
    <div className="flex flex-col">
      {children}
      <div className="mt-8 text-center">
        <Button
          size="lg"
          onClick={connectWallet}
          loading={state.loading}
          icon={Wallet}
          className="px-8 py-4 text-lg"
        >
          Connect Phantom Wallet
        </Button>
      </div>
    </div>
  );
};