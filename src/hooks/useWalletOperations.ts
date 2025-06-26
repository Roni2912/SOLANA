import { useCallback } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useApp } from '../contexts/AppContext';
import { useConnection } from './useConnection';
import { WalletAdapter, TokenInfo, TransactionRecord } from '../types';

export const useWalletOperations = () => {
  const { state, dispatch } = useApp();
  const connection = useConnection();

  const connectWallet = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_MESSAGES' });
      
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error('Phantom wallet not found. Please install Phantom wallet extension.');
      }

      const response = await window.solana.connect();
      
      // Create a properly formatted wallet adapter for SPL Token compatibility
      const walletAdapter: WalletAdapter = {
        publicKey: response.publicKey,
        connected: true,
        connecting: false,
        disconnect: async () => {
          await window.solana.disconnect();
          localStorage.removeItem('walletConnected');
          dispatch({ type: 'SET_WALLET', payload: null });
          dispatch({ type: 'SET_BALANCE', payload: 0 });
          dispatch({ type: 'SET_TOKENS', payload: [] });
          dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
        },
        connect: window.solana.connect,
        signTransaction: window.solana.signTransaction,
        signAllTransactions: window.solana.signAllTransactions
      };

      dispatch({ type: 'SET_WALLET', payload: walletAdapter });
      
      localStorage.setItem('walletConnected', 'true');
      
      dispatch({ type: 'SET_SUCCESS', payload: '🎉 Wallet connected successfully!' });
      
      await fetchWalletData(walletAdapter);
      
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to connect wallet' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, connection]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (state.wallet) {
        await state.wallet.disconnect();
        dispatch({ type: 'SET_WALLET', payload: null });
        dispatch({ type: 'SET_BALANCE', payload: 0 });
        dispatch({ type: 'SET_TOKENS', payload: [] });
        dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
        
        localStorage.removeItem('walletConnected');
        
        dispatch({ type: 'SET_SUCCESS', payload: '👋 Wallet disconnected successfully!' });
      }
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to disconnect wallet' });
    }
  }, [state.wallet, dispatch]);

  const fetchWalletData = useCallback(async (wallet: WalletAdapter | null = state.wallet) => {
    if (!wallet?.publicKey) return;

    try {
      dispatch({ type: 'SET_REFRESHING', payload: true });
      
      // Fetch SOL balance
      const balance = await connection.getBalance(wallet.publicKey);
      dispatch({ type: 'SET_BALANCE', payload: balance / LAMPORTS_PER_SOL });

      // Fetch token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const tokens: TokenInfo[] = [];
      for (const { account } of tokenAccounts.value) {
        const tokenInfo = account.data.parsed.info;
        if (tokenInfo.tokenAmount.uiAmount > 0) {
          try {
            const mintInfo = await getMint(connection, tokenInfo.mint);
            tokens.push({
              mint: tokenInfo.mint,
              balance: tokenInfo.tokenAmount.uiAmount,
              decimals: tokenInfo.tokenAmount.decimals,
              symbol: `TOKEN${tokens.length + 1}`,
              name: `Custom Token ${tokens.length + 1}`,
              supply: Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals),
              owner: tokenInfo.owner,
              isInitialized: mintInfo.isInitialized,
              mintAuthority: mintInfo.mintAuthority?.toString(),
              freezeAuthority: mintInfo.freezeAuthority?.toString()
            });
          } catch (e) {
            console.error('Error fetching mint info:', e);
          }
        }
      }
      
      dispatch({ type: 'SET_TOKENS', payload: tokens });

      // Fetch recent transactions
      const signatures = await connection.getSignaturesForAddress(
        wallet.publicKey,
        { limit: 20 }
      );

      const transactions: TransactionRecord[] = signatures.map((sig, index) => ({
        signature: sig.signature,
        type: index % 4 === 0 ? 'create' : index % 4 === 1 ? 'mint' : index % 4 === 2 ? 'transfer' : 'airdrop',
        status: sig.err ? 'failed' : 'confirmed',
        timestamp: (sig.blockTime || Date.now() / 1000) * 1000,
        blockTime: sig.blockTime,
        fee: 0.000005
      }));

      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      
    } catch (err) {
      console.error('Failed to fetch wallet data:', err);
    } finally {
      dispatch({ type: 'SET_REFRESHING', payload: false });
    }
  }, [state.wallet, connection, dispatch]);

  const requestAirdrop = useCallback(async () => {
    if (!state.wallet?.publicKey || !state.wallet.connected) {
      dispatch({ type: 'SET_ERROR', payload: 'Please connect your wallet first' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const signature = await connection.requestAirdrop(
        state.wallet.publicKey,
        LAMPORTS_PER_SOL
      );
      
      await connection.confirmTransaction(signature);
      
      const transaction: TransactionRecord = {
        signature,
        type: 'airdrop',
        status: 'confirmed',
        timestamp: Date.now(),
        amount: 1,
        fee: 0
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      const walletAddress = state.wallet.publicKey.toString();
      const updatedTransactions = [transaction, ...state.transactions];
      localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(updatedTransactions));
      
      dispatch({ type: 'SET_SUCCESS', payload: '💰 Received 1 SOL airdrop!' });
      
      await fetchWalletData();
      
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: 'Airdrop failed. Please try again later.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.wallet, connection, dispatch, fetchWalletData]);

  return {
    connectWallet,
    disconnectWallet,
    fetchWalletData,
    requestAirdrop
  };
};