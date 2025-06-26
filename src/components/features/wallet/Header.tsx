import React from 'react';
import { Coins, ExternalLink, Wallet, Menu, X, Droplets } from 'lucide-react';
import { useApp } from '../../../contexts';
import { useWalletOperations } from '../../../hooks';
import { Button } from '../../ui';

export const Header: React.FC = () => {
  const { state, dispatch } = useApp();
  const { connectWallet, disconnectWallet, requestAirdrop } = useWalletOperations();

  return (
    <header className="bg-white border-b border-gray-300 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-lg shadow-md">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">SolanaTokenHub</h1>
              <p className="text-sm text-slate-600 hidden sm:block font-medium">Professional Token Management Platform</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Devnet
            </div>
            
            {state.wallet && (
              <a
                href={`https://explorer.solana.com/address/${state.wallet.publicKey?.toString()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Explorer
              </a>
            )}
          </div>

          <div className="flex items-center gap-4">
            {state.wallet ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    {(() => {
                      if (state.wallet?.publicKey) {
                        try {
                          const pkString = state.wallet.publicKey.toString();
                          return `${pkString.slice(0, 4)}...${pkString.slice(-4)}`;
                        } catch (error) {
                          return 'Error';
                        }
                      }
                      return 'Connecting...';
                    })()}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">{state.balance.toFixed(4)} SOL</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={requestAirdrop}
                  icon={Droplets}
                  loading={state.loading}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <span className="hidden sm:inline">Airdrop</span>
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={disconnectWallet}
                  icon={Wallet}
                >
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                loading={state.loading}
                icon={Wallet}
                size="md"
              >
                Connect Wallet
              </Button>
            )}

            <button
              className="md:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => dispatch({ type: 'SET_MOBILE_MENU', payload: !state.mobileMenuOpen })}
            >
              {state.mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {state.mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-300 shadow-sm">
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Connected to Devnet
            </div>
            {state.wallet && (
              <a
                href={`https://explorer.solana.com/address/${state.wallet.publicKey?.toString()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};