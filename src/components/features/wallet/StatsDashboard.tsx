import React from 'react';
import { DollarSign, Coins, Activity, TrendingUp, Zap, RefreshCw, Download, Globe, ExternalLink } from 'lucide-react';
import { useApp } from '../../../contexts';
import { useWalletOperations } from '../../../hooks';
import { Card, Button } from '../../ui';
import { StatItem } from '../../../types';

export const StatsDashboard: React.FC = () => {
  const { state } = useApp();
  const { fetchWalletData, requestAirdrop } = useWalletOperations();

  const stats: StatItem[] = [
    {
      label: 'SOL Balance',
      value: `${state.balance.toFixed(4)} SOL`,
      change: '+0.0%',
      changeType: 'neutral',
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Total Tokens',
      value: state.tokens.length.toString(),
      change: '+0',
      changeType: 'positive',
      icon: Coins,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Transactions',
      value: state.transactions.length.toString(),
      change: `+${state.transactions.filter(tx => tx.timestamp > Date.now() - 24*60*60*1000).length}`,
      changeType: 'positive',
      icon: Activity,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Success Rate',
      value: '100%',
      change: '+0.0%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-8 -translate-y-8`}></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-600' :
                  stat.changeType === 'negative' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
      
      <div className="col-span-full">
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchWalletData()}
                loading={state.refreshing}
                icon={RefreshCw}
              >
                Refresh
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="primary"
              onClick={requestAirdrop}
              loading={state.loading}
              icon={Download}
              className="w-full"
            >
              Request Airdrop
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open('https://faucet.solana.com/', '_blank')}
              icon={Globe}
              className="w-full"
            >
              Solana Faucet
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                console.log('StatsDashboard: Explorer button clicked');
                console.log('StatsDashboard: wallet:', state.wallet);
                console.log('StatsDashboard: publicKey:', state.wallet?.publicKey);
                if (state.wallet?.publicKey) {
                  try {
                    const address = state.wallet.publicKey.toString();
                    console.log('StatsDashboard: address string:', address);
                    window.open(`https://explorer.solana.com/address/${address}?cluster=devnet`, '_blank');
                  } catch (error) {
                    console.error('StatsDashboard: Error with explorer link:', error);
                  }
                } else {
                  console.error('StatsDashboard: No wallet connected');
                }
              }}
              icon={ExternalLink}
              className="w-full"
            >
              View Explorer
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};