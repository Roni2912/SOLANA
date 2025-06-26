import React from 'react';
import { BarChart3, Coins, Copy } from 'lucide-react';
import { useApp } from '../../../contexts';
import { Card } from '../../ui';

export const TokenPortfolio: React.FC = () => {
  const { state } = useApp();

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Token Portfolio</h3>
              <p className="text-sm text-gray-500">Your token holdings</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Tokens</p>
            <p className="text-2xl font-bold text-gray-900">{state.tokens.length}</p>
          </div>
        </div>
      }
    >
      {state.tokens.length === 0 ? (
        <div className="text-center py-12">
          <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tokens yet</h3>
          <p className="text-gray-500">Create your first token to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {state.tokens.map((token, index) => (
            <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{token.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{token.name}</h4>
                    <p className="text-sm text-gray-500">{token.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{token.balance.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Balance</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Supply</p>
                    <p className="font-medium text-gray-900">{token.supply?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Decimals</p>
                    <p className="font-medium text-gray-900">{token.decimals}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Mint Address</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-gray-900">{token.mint.slice(0, 8)}...</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(token.mint)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Authority</p>
                    <p className="font-medium text-gray-900">{token.mintAuthority ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};