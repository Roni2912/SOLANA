import React from 'react';
import { AppProvider, useApp } from './contexts';
import { Header, AlertSystem, Footer } from './components';
import { 
  TokenCreator, 
  TokenMinter, 
  TokenTransfer, 
  TokenPortfolio 
} from './components/features/token';
import { TransactionHistory } from './components/features/transaction';
import { StatsDashboard, WalletConnection } from './components/features/wallet';
import './index.css';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <div className="bg-white rounded-2xl shadow-lg p-12">
        <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Welcome to SolanaTokenHub
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          The professional platform for creating, minting, and managing SPL tokens on Solana. 
          Connect your wallet to access powerful token management tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Create Tokens</h3>
            <p className="text-slate-600">Launch custom SPL tokens with full control over supply and parameters</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Mint Supply</h3>
            <p className="text-slate-600">Increase token supply with secure, authenticated minting operations</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Transfer Tokens</h3>
            <p className="text-slate-600">Send tokens to any Solana address with instant confirmation</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure Connection
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Devnet Environment
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Non-Custodial
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { state } = useApp();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AlertSystem />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!state.wallet ? (
          <WalletConnection>
            <WelcomeScreen />
          </WalletConnection>
        ) : (
          <div className="space-y-8">
            {/* Stats Dashboard */}
            <StatsDashboard />
            
            {/* Token Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <TokenCreator />
              <TokenMinter />
              <TokenTransfer />
            </div>
            
            {/* Portfolio and History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TokenPortfolio />
              <TransactionHistory />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

const MainApp: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default MainApp;