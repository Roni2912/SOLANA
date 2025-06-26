import React, { useState } from 'react';
import { Zap, CheckCircle } from 'lucide-react';
import { useApp } from '../../../contexts';
import { useTokenOperations } from '../../../hooks';
import { Card, Input, Button } from '../../ui';
import { MintFormData } from '../../../types';

export const TokenMinter: React.FC = () => {
  const { state } = useApp();
  const { mintTokens } = useTokenOperations();
  const [formData, setFormData] = useState<MintFormData>({
    tokenMint: '',
    amount: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tokenMint || formData.amount <= 0) return;
    
    await mintTokens(formData.tokenMint, formData.amount);
    setFormData({ tokenMint: '', amount: 0 });
  };

  return (
    <Card
      header={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mint Tokens</h3>
            <p className="text-sm text-gray-500">Increase supply of existing tokens</p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Token</label>
          <select
            value={formData.tokenMint}
            onChange={(e) => setFormData(prev => ({ ...prev, tokenMint: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Choose a token to mint</option>
            {state.tokens.map(token => (
              <option key={token.mint} value={token.mint}>
                {token.symbol} - {token.name} (Balance: {token.balance.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Amount to Mint"
          type="number"
          placeholder="Enter amount"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
          icon={Zap}
        />

        {formData.tokenMint && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Minting Preview</p>
                <p>You will mint {formData.amount.toLocaleString()} tokens to your wallet</p>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="success"
          size="lg"
          loading={state.loading}
          disabled={!state.wallet || !formData.tokenMint || formData.amount <= 0}
          icon={Zap}
          className="w-full"
        >
          Mint Tokens
        </Button>
      </form>
    </Card>
  );
};