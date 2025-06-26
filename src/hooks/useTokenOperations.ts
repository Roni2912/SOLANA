import { useCallback } from 'react';
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction, Keypair } from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
  createTransferInstruction
} from '@solana/spl-token';
import { useApp } from '../contexts/AppContext';
import { useConnection } from './useConnection';
import { TokenFormData, TokenInfo, TransactionRecord } from '../types';

export const useTokenOperations = () => {
  const { state, dispatch } = useApp();
  const connection = useConnection();

  const createToken = useCallback(async (tokenData: TokenFormData) => {
    if (!state.wallet?.publicKey || !state.wallet.connected) {
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

      // Create complete token in a single transaction (mint + ATA + initial supply)
      let mint;
      
      // Generate mint keypair
      const mintKeypair = Keypair.generate();
      mint = mintKeypair.publicKey;
      
      // Calculate associated token address
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mint,
        state.wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      
      // Calculate rent exemption for mint
      const mintLamports = await getMinimumBalanceForRentExemptMint(connection);
      
      // Build complete transaction with all instructions
      const completeTransaction = new Transaction();
      
      // 1. Create mint account
      completeTransaction.add(
        SystemProgram.createAccount({
          fromPubkey: state.wallet.publicKey,
          newAccountPubkey: mint,
          space: MINT_SIZE,
          lamports: mintLamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );
      
      // 2. Initialize mint
      completeTransaction.add(
        createInitializeMintInstruction(
          mint,
          tokenData.decimals,
          state.wallet.publicKey,
          state.wallet.publicKey,
          TOKEN_PROGRAM_ID
        )
      );
      
      // 3. Create associated token account
      completeTransaction.add(
        createAssociatedTokenAccountInstruction(
          state.wallet.publicKey,
          associatedTokenAddress,
          state.wallet.publicKey,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
      
      // 4. Mint initial supply (if specified)
      if (tokenData.supply > 0) {
        const mintAmount = tokenData.supply * Math.pow(10, tokenData.decimals);
        completeTransaction.add(
          createMintToInstruction(
            mint,
            associatedTokenAddress,
            state.wallet.publicKey,
            mintAmount,
            [],
            TOKEN_PROGRAM_ID
          )
        );
      }
      
      // Set transaction metadata
      const { blockhash } = await connection.getLatestBlockhash();
      completeTransaction.recentBlockhash = blockhash;
      completeTransaction.feePayer = state.wallet.publicKey;
      
      // Sign with mint keypair first
      completeTransaction.partialSign(mintKeypair);
      
      // Sign with wallet (this will be the only confirmation prompt)
      const signedTransaction = await state.wallet.signTransaction(completeTransaction);
      
      // Send and confirm
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature);
      
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
      
      if (state.wallet?.publicKey) {
        const walletAddress = state.wallet.publicKey.toString();
        const updatedTokens = [...state.tokens, newToken];
        const updatedTransactions = [transaction, ...state.transactions];
        localStorage.setItem(`tokens_${walletAddress}`, JSON.stringify(updatedTokens));
        localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(updatedTransactions));
      }
      
      dispatch({ type: 'SET_SUCCESS', payload: `🚀 Token "${tokenData.symbol}" created successfully!` });
      
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to create token' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.wallet, state.balance, connection, dispatch]);

  const mintTokens = useCallback(async (tokenMint: string, amount: number) => {
    if (!state.wallet?.publicKey || !state.wallet.connected) {
      dispatch({ type: 'SET_ERROR', payload: 'Please connect your wallet first' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const mint = new PublicKey(tokenMint);
      const token = state.tokens.find(t => t.mint === tokenMint);
      
      if (!token) {
        dispatch({ type: 'SET_ERROR', payload: 'Token not found' });
        return;
      }

      // Get associated token address
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mint,
        state.wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Create mint transaction
      const mintAmount = amount * Math.pow(10, token.decimals);
      const mintTransaction = new Transaction().add(
        createMintToInstruction(
          mint,
          associatedTokenAddress,
          state.wallet.publicKey,
          mintAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Set transaction metadata
      const { blockhash } = await connection.getLatestBlockhash();
      mintTransaction.recentBlockhash = blockhash;
      mintTransaction.feePayer = state.wallet.publicKey;

      // Sign and send transaction
      const signedTransaction = await state.wallet.signTransaction(mintTransaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature);

      // Update token balance
      const updatedToken = { ...token, balance: token.balance + amount };
      dispatch({
        type: 'UPDATE_TOKEN',
        payload: { mint: tokenMint, balance: token.balance + amount }
      });

      const transaction: TransactionRecord = {
        signature,
        type: 'mint',
        status: 'confirmed',
        timestamp: Date.now(),
        amount,
        token: token.symbol,
        fee: 0.001
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      if (state.wallet?.publicKey) {
        const walletAddress = state.wallet.publicKey.toString();
        const updatedTokens = state.tokens.map(t => t.mint === tokenMint ? updatedToken : t);
        const updatedTransactions = [transaction, ...state.transactions];
        localStorage.setItem(`tokens_${walletAddress}`, JSON.stringify(updatedTokens));
        localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(updatedTransactions));
      }
      
      dispatch({ type: 'SET_SUCCESS', payload: `✨ Successfully minted ${amount} ${token.symbol}!` });
      
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to mint tokens' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.wallet, state.tokens, connection, dispatch]);

  const transferTokens = useCallback(async (tokenMint: string, recipient: string, amount: number) => {
    if (!state.wallet?.publicKey || !state.wallet.connected) {
      dispatch({ type: 'SET_ERROR', payload: 'Please connect your wallet first' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const mint = new PublicKey(tokenMint);
      const recipientPubkey = new PublicKey(recipient);
      const token = state.tokens.find(t => t.mint === tokenMint);
      
      if (!token) {
        dispatch({ type: 'SET_ERROR', payload: 'Token not found' });
        return;
      }

      // Get sender's associated token address
      const fromTokenAddress = await getAssociatedTokenAddress(
        mint,
        state.wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Get recipient's associated token address
      const toTokenAddress = await getAssociatedTokenAddress(
        mint,
        recipientPubkey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Check if recipient's ATA exists
      const recipientATAInfo = await connection.getAccountInfo(toTokenAddress);
      
      // Build transfer transaction
      const transferTransaction = new Transaction();
      
      // If recipient's ATA doesn't exist, create it first
      if (!recipientATAInfo) {
        transferTransaction.add(
          createAssociatedTokenAccountInstruction(
            state.wallet.publicKey, // payer
            toTokenAddress,          // associated token account
            recipientPubkey,         // owner
            mint,                    // mint
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }

      // Add transfer instruction
      const transferAmount = amount * Math.pow(10, token.decimals);
      transferTransaction.add(
        createTransferInstruction(
          fromTokenAddress,     // source
          toTokenAddress,       // destination
          state.wallet.publicKey, // owner
          transferAmount,       // amount
          [],                   // multiSigners
          TOKEN_PROGRAM_ID
        )
      );

      // Set transaction metadata
      const { blockhash } = await connection.getLatestBlockhash();
      transferTransaction.recentBlockhash = blockhash;
      transferTransaction.feePayer = state.wallet.publicKey;

      // Sign and send transaction
      const signedTransaction = await state.wallet.signTransaction(transferTransaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature);

      const transaction: TransactionRecord = {
        signature,
        type: 'transfer',
        status: 'confirmed',
        timestamp: Date.now(),
        amount,
        token: token.symbol,
        recipient,
        fee: 0.001
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      // Update token balance
      const updatedToken = { ...token, balance: token.balance - amount };
      dispatch({
        type: 'UPDATE_TOKEN',
        payload: { mint: tokenMint, balance: token.balance - amount }
      });
      
      if (state.wallet?.publicKey) {
        const walletAddress = state.wallet.publicKey.toString();
        const updatedTokens = state.tokens.map(t => t.mint === tokenMint ? updatedToken : t);
        const updatedTransactions = [transaction, ...state.transactions];
        localStorage.setItem(`tokens_${walletAddress}`, JSON.stringify(updatedTokens));
        localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(updatedTransactions));
      }
      
      dispatch({ type: 'SET_SUCCESS', payload: `📤 Successfully transferred ${amount} ${token.symbol}!` });
      
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to transfer tokens' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.wallet, state.tokens, connection, dispatch]);

  return { createToken, mintTokens, transferTokens };
};