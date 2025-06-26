import React, { useState } from 'react';
import { Send, User, CheckCircle } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import { useApp } from '../../../contexts';
import { useTokenOperations } from '../../../hooks';
import { Card, Input, Button } from '../../ui';
import { TransferFormData } from '../../../types';

export const TokenTransfer: React.FC = () => {
  const { state } = useApp();
  const { transferTokens } = useTokenOperations();
  const [formData, setFormData] = useState<TransferFormData>({
    tokenMint: '',
    recipient: '',
    amount: 0
  });
  const [validAddress, setValidAddress] = useState(false);

  const validateAddress = (address: string) => {
    try {
      new PublicKey(address);
      setValidAddress(true);
    } catch {
      setValidAddress(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tokenMint || !formData.recipient || formData.amount <= 0 || !validAddress) return;
    
    await transferTokens(formData.tokenMint, formData.recipient, formData.amount);
    setFormData({ tokenMint: '', recipient: '', amount: 0 });
    setValidAddress(false);
  };

  return (
    <Card
      header={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Transfer Tokens</h3>
            <p className="text-sm text-gray-500">Send tokens to another address</p>
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a token to transfer</option>
            {state.tokens.filter(token => token.balance > 0).map(token => (
              <option key={token.mint} value={token.mint}>
                {token.symbol} - Balance: {token.balance.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Input
            label="Recipient Address"
            placeholder="Enter Solana wallet address"
            value={formData.recipient}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, recipient: e.target.value }));
              validateAddress(e.target.value);
            }}
            icon={User}
            error={formData.recipient && !validAddress ? 'Invalid Solana address' : ''}
          />
          {validAddress && (
            <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              Valid address
            </div>
          )}
        </div>

        <Input
          label="Amount"
          type="number"
          placeholder="Enter amount to transfer"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
          icon={Send}
        />

        {formData.tokenMint && formData.amount > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Send className="w-5 h-5 text-purple-500" />
              <div className="text-sm text-purple-800">
                <p className="font-medium">Transfer Preview</p>
                <p>Send {formData.amount.toLocaleString()} {state.tokens.find(t => t.mint === formData.tokenMint)?.symbol} tokens</p>
                <p className="text-purple-600">Transaction fee: ~0.001 SOL</p>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={state.loading}
          disabled={!state.wallet || !formData.tokenMint || !formData.recipient || formData.amount <= 0 || !validAddress}
          icon={Send}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          Transfer Tokens
        </Button>
      </form>
    </Card>
  );
};