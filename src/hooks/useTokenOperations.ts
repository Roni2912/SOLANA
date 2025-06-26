import { useCallback } from 'react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer
} from '@solana/spl-token';
import { useApp } from '../contexts/AppContext';
import { useConnection } from './useConnection';
import { TokenFormData, TokenInfo, TransactionRecord } from '../types';

export const useTokenOperations = () => {
  const { state, dispatch } = useApp();
  const connection = useConnection();

  const createToken = useCallback(async (tokenData: TokenFormData) => {
    if (!state.wallet?.publicKey) {
      dispatch({ type: 'SET_ERROR', payload: 'Please connect your wallet first' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_MESSAGES' });

      // Check balance and request airdrop if needed
      if (state.balance < 0.1) {
        const airdropSig = await connection.requestAirdrop(state.wallet.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(airdropSig);
      }

      // Create mint
      const mint = await createMint(
        connection,
        state.wallet as any,
        state.wallet.publicKey,
        state.wallet.publicKey,
        tokenData.decimals
      );

      // Create associated token account
      const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        state.wallet as any,
        mint,
        state.wallet.publicKey
      );

      // Mint initial supply
      if (tokenData.supply > 0) {
        await mintTo(
          connection,
          state.wallet as any,
          mint,
          associatedTokenAccount.address,
          state.wallet.publicKey,
          tokenData.supply * Math.pow(10, tokenData.decimals)
        );
      }

      const newToken: TokenInfo = {
        mint: mint.toString(),
        balance: tokenData.supply,
        decimals: tokenData.decimals,
        symbol: tokenData.symbol,
        name: tokenData.name,
        supply: tokenData.supply,
        owner: state.wallet.publicKey.toString(),
        isInitialized: true,
        mintAuthority: state.wallet.publicKey.toString()
      };

      dispatch({ type: 'ADD_TOKEN', payload: newToken });
      
      const transaction: TransactionRecord = {
        signature: mint.toString(),
        type: 'create',
        status: 'confirmed',
        timestamp: Date.now(),
        token: tokenData.symbol,
        amount: tokenData.supply,
        fee: 0.002
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      const walletAddress = state.wallet.publicKey.toString();
      const updatedTokens = [...state.tokens, newToken];
      const updatedTransactions = [transaction, ...state.transactions];
      localStorage.setItem(`tokens_${walletAddress}`, JSON.stringify(updatedTokens));
      localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(updatedTransactions));
      
      dispatch({ type: 'SET_SUCCESS', payload: `🚀 Token "${tokenData.symbol}" created successfully!` });
      
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to create token' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.wallet, state.balance, connection, dispatch]);

  const mintTokens = useCallback(async (tokenMint: string, amount: number) => {
    if (!state.wallet?.publicKey) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const mint = new PublicKey(tokenMint);
      const token = state.tokens.find(t => t.mint === tokenMint);
      
      const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        state.wallet as any,
        mint,
        state.wallet.publicKey
      );

      await mintTo(
        connection,
        state.wallet as any,
        mint,
        associatedTokenAccount.address,
        state.wallet.publicKey,
        amount * Math.pow(10, token?.decimals || 9)
      );

      // Update token balance
      const updatedToken = { ...token!, balance: (token?.balance || 0) + amount };
      dispatch({
        type: 'UPDATE_TOKEN',
        payload: { mint: tokenMint, balance: (token?.balance || 0) + amount }
      });

      const transaction: TransactionRecord = {
        signature: `mint_${Date.now()}`,
        type: 'mint',
        status: 'confirmed',
        timestamp: Date.now(),
        amount,
        token: token?.symbol || 'Unknown',
        fee: 0.001
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      const walletAddress = state.wallet.publicKey.toString();
      const updatedTokens = state.tokens.map(t => t.mint === tokenMint ? updatedToken : t);
      const updatedTransactions = [transaction, ...state.transactions];
      localStorage.setItem(`tokens_${walletAddress}`, JSON.stringify(updatedTokens));
      localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(updatedTransactions));
      
      dispatch({ type: 'SET_SUCCESS', payload: `✨ Successfully minted ${amount} ${token?.symbol}!` });
      
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to mint tokens' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.wallet, state.tokens, connection, dispatch]);

  const transferTokens = useCallback(async (tokenMint: string, recipient: string, amount: number) => {
    if (!state.wallet?.publicKey) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const mint = new PublicKey(tokenMint);
      const recipientPubkey = new PublicKey(recipient);
      const token = state.tokens.find(t => t.mint === tokenMint);
      
      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        state.wallet as any,
        mint,
        state.wallet.publicKey
      );
      
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        state.wallet as any,
        mint,
        recipientPubkey
      );

      const signature = await transfer(
        connection,
        state.wallet as any,
        fromTokenAccount.address,
        toTokenAccount.address,
        state.wallet.publicKey,
        amount * Math.pow(10, token?.decimals || 9)
      );

      const transaction: TransactionRecord = {
        signature,
        type: 'transfer',
        status: 'confirmed',
        timestamp: Date.now(),
        amount,
        token: token?.symbol || 'Unknown',
        recipient,
        fee: 0.001
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      // Update token balance
      const updatedToken = { ...token!, balance: (token?.balance || 0) - amount };
      dispatch({
        type: 'UPDATE_TOKEN',
        payload: { mint: tokenMint, balance: (token?.balance || 0) - amount }
      });
      
      const walletAddress = state.wallet.publicKey.toString();
      const updatedTokens = state.tokens.map(t => t.mint === tokenMint ? updatedToken : t);
      const updatedTransactions = [transaction, ...state.transactions];
      localStorage.setItem(`tokens_${walletAddress}`, JSON.stringify(updatedTokens));
      localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(updatedTransactions));
      
      dispatch({ type: 'SET_SUCCESS', payload: `📤 Successfully transferred ${amount} ${token?.symbol}!` });
      
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to transfer tokens' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.wallet, state.tokens, connection, dispatch]);

  return { createToken, mintTokens, transferTokens };
};