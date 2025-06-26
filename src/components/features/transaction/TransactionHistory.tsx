import React, { useState } from 'react';
import { History, Plus, Zap, Send, Download, Activity, Copy } from 'lucide-react';
import { useApp } from '../../../contexts';
import { Card } from '../../ui';

export const TransactionHistory: React.FC = () => {
  const { state } = useApp();
  const [filter, setFilter] = useState('all');

  const filteredTransactions = state.transactions.filter(tx => 
    filter === 'all' || tx.type === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'create': return Plus;
      case 'mint': return Zap;
      case 'transfer': return Send;
      case 'airdrop': return Download;
      default: return Activity;
    }
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              <p className="text-sm text-gray-500">Recent blockchain activities</p>
            </div>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="create">Create</option>
            <option value="mint">Mint</option>
            <option value="transfer">Transfer</option>
            <option value="airdrop">Airdrop</option>
          </select>
        </div>
      }
    >
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-500">Your transaction history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredTransactions.map((tx, index) => {
            const Icon = getTypeIcon(tx.type);
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'create' ? 'bg-blue-100 text-blue-600' :
                      tx.type === 'mint' ? 'bg-green-100 text-green-600' :
                      tx.type === 'transfer' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">{tx.type} Transaction</h4>
                      <p className="text-sm text-gray-500">
                        {tx.type === 'create' && tx.token && `Created ${tx.token}`}
                        {tx.type === 'mint' && tx.amount && tx.token && `Minted ${tx.amount.toLocaleString()} ${tx.token}`}
                        {tx.type === 'transfer' && tx.amount && tx.token && `Sent ${tx.amount.toLocaleString()} ${tx.token}`}
                        {tx.type === 'airdrop' && tx.amount && `Received ${tx.amount} SOL`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>Signature:</span>
                    <span className="font-mono">{tx.signature.slice(0, 16)}...</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(tx.signature)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  {tx.fee && (
                    <span>Fee: {tx.fee} SOL</span>
                  )}
                </div>
                
                {tx.recipient && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span>To: {tx.recipient.slice(0, 8)}...{tx.recipient.slice(-8)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};