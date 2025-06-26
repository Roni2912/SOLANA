import React, { useState } from 'react';
import { Plus, Star, Coins, BarChart3, AlertCircle } from 'lucide-react';
import { useApp } from '../../../contexts';
import { useTokenOperations } from '../../../hooks';
import { Card, Input, Button } from '../../ui';
import { TokenFormData } from '../../../types';

export const TokenCreator: React.FC = () => {
  const { state } = useApp();
  const { createToken } = useTokenOperations();
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    decimals: 9,
    supply: 1000000,
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Token name is required';
    if (!formData.symbol.trim()) newErrors.symbol = 'Token symbol is required';
    if (formData.symbol.length > 10) newErrors.symbol = 'Symbol must be 10 characters or less';
    if (formData.decimals < 0 || formData.decimals > 9) newErrors.decimals = 'Decimals must be between 0 and 9';
    if (formData.supply < 0) newErrors.supply = 'Supply must be positive';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    await createToken(formData);
    
    if (!state.error) {
      setFormData({
        name: '',
        symbol: '',
        decimals: 9,
        supply: 1000000,
        description: ''
      });
    }
  };

  return (
    <Card
      header={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Create New Token</h3>
            <p className="text-sm text-gray-500">Deploy a custom SPL token on Solana</p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Token Name"
            placeholder="My Awesome Token"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            icon={Star}
          />
          
          <Input
            label="Token Symbol"
            placeholder="MAT"
            value={formData.symbol}
            onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
            error={errors.symbol}
            icon={Coins}
          />
        </div>

        <Input
          label="Description (Optional)"
          placeholder="Describe your token's purpose and utility"
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Decimals</label>
            <select
              value={formData.decimals}
              onChange={(e) => setFormData(prev => ({ ...prev, decimals: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[0,1,2,3,4,5,6,7,8,9].map(num => (
                <option key={num} value={num}>{num} decimals</option>
              ))}
            </select>
            {errors.decimals && <p className="text-sm text-red-600 mt-1">{errors.decimals}</p>}
          </div>
          
          <Input
            label="Initial Supply"
            type="number"
            placeholder="1000000"
            value={formData.supply}
            onChange={(e) => setFormData(prev => ({ ...prev, supply: parseInt(e.target.value) || 0 }))}
            error={errors.supply}
            icon={BarChart3}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Token Creation Info</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Creating a token requires ~0.002 SOL for transaction fees</li>
                <li>You will be the mint authority and freeze authority</li>
                <li>Initial supply will be minted to your wallet</li>
                <li>Token will be deployed on Solana Devnet</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          loading={state.loading}
          disabled={!state.wallet}
          icon={Plus}
          className="w-full"
        >
          Create Token
        </Button>
      </form>
    </Card>
  );
};