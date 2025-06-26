import React from 'react';
import { Coins, Shield, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">SolanaTokenHub</h3>
                <p className="text-sm text-gray-500">Professional Token Management Platform</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              The most advanced platform for creating, minting, and managing SPL tokens on Solana. 
              Built with security, performance, and user experience in mind.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                Secure & Audited
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Globe className="w-4 h-4" />
                Devnet Environment
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://docs.solana.com" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Solana Documentation
                </a>
              </li>
              <li>
                <a href="https://spl.solana.com/token" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  SPL Token Program
                </a>
              </li>
              <li>
                <a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Solana Explorer
                </a>
              </li>
              <li>
                <a href="https://faucet.solana.com" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Devnet Faucet
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tools</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Phantom Wallet
                </a>
              </li>
              <li>
                <a href="https://solflare.com" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Solflare Wallet
                </a>
              </li>
              <li>
                <a href="https://github.com/solana-labs/solana-web3.js" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Solana Web3.js
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Connected to Solana Devnet
              </div>
              <span>•</span>
              <span>Built for educational purposes</span>
            </div>
            
            <div className="text-sm text-gray-500">
              © 2024 SolanaTokenHub. Educational platform for learning Solana development.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};