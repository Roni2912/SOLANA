import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction } from '../types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection } from '../hooks/useConnection';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_WALLET':
      return { ...state, wallet: action.payload };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_TOKENS':
      return { ...state, tokens: action.payload };
    case 'ADD_TOKEN':
      return { ...state, tokens: [...state.tokens, action.payload] };
    case 'UPDATE_TOKEN':
      return { 
        ...state, 
        tokens: state.tokens.map(token => 
          token.mint === action.payload.mint ? { ...token, ...action.payload } : token
        )
      };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(tx =>
          tx.signature === action.payload.signature ? { ...tx, ...action.payload } : tx
        )
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_MOBILE_MENU':
      return { ...state, mobileMenuOpen: action.payload };
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, error: '', success: '' };
    default:
      return state;
  }
};

const initialState: AppState = {
  wallet: null,
  balance: 0,
  tokens: [],
  transactions: [],
  loading: false,
  error: '',
  success: '',
  darkMode: false,
  mobileMenuOpen: false,
  refreshing: false
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const connection = useConnection();

  // Auto-reconnect wallet on page load
  useEffect(() => {
    let hasAttempted = false;
    
    const autoReconnect = async () => {
      if (hasAttempted) return;
      hasAttempted = true;
      
      try {
        // Wait a bit for Phantom to load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const savedWalletConnected = localStorage.getItem('walletConnected');
        
        if (savedWalletConnected === 'true' && window.solana?.isPhantom) {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          
          if (response.publicKey) {
            const walletAdapter = {
              publicKey: response.publicKey,
              connected: true,
              connecting: false,
              disconnect: window.solana.disconnect,
              connect: window.solana.connect,
              signTransaction: window.solana.signTransaction,
              signAllTransactions: window.solana.signAllTransactions
            };

            dispatch({ type: 'SET_WALLET', payload: walletAdapter });
            
            // Fetch balance
            const balance = await connection.getBalance(response.publicKey);
            dispatch({ type: 'SET_BALANCE', payload: balance / LAMPORTS_PER_SOL });
            
            const walletAddress = response.publicKey.toString();
            const savedTokens = localStorage.getItem(`tokens_${walletAddress}`);
            const savedTransactions = localStorage.getItem(`transactions_${walletAddress}`);
            
            if (savedTokens) {
              dispatch({ type: 'SET_TOKENS', payload: JSON.parse(savedTokens) });
            }
            if (savedTransactions) {
              dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(savedTransactions) });
            }
          }
        }
      } catch (error) {
        // Silent fail for auto-reconnect
      }
    };

    // Run once on mount
    const timer = setTimeout(autoReconnect, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};