import { PublicKey, Transaction } from '@solana/web3.js';

export interface WalletAdapter {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  disconnect: () => Promise<void>;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

export interface TransactionRecord {
  signature: string;
  type: 'create' | 'mint' | 'transfer' | 'airdrop';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  amount?: number;
  token?: string;
  recipient?: string;
  fee?: number;
  blockTime?: number | null;
}

export interface TokenInfo {
  mint: string;
  balance: number;
  decimals: number;
  symbol: string;
  name: string;
  supply: number;
  owner: string;
  freezeAuthority?: string;
  mintAuthority?: string;
  isInitialized: boolean;
}

export interface AppState {
  wallet: WalletAdapter | null;
  balance: number;
  tokens: TokenInfo[];
  transactions: TransactionRecord[];
  loading: boolean;
  error: string;
  success: string;
  darkMode: boolean;
  mobileMenuOpen: boolean;
  refreshing: boolean;
}

export interface TokenFormData {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  description?: string;
}

export interface MintFormData {
  tokenMint: string;
  amount: number;
}

export interface TransferFormData {
  tokenMint: string;
  recipient: string;
  amount: number;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export type AppAction =
  | { type: 'SET_WALLET'; payload: WalletAdapter | null }
  | { type: 'SET_BALANCE'; payload: number }
  | { type: 'SET_TOKENS'; payload: TokenInfo[] }
  | { type: 'ADD_TOKEN'; payload: TokenInfo }
  | { type: 'UPDATE_TOKEN'; payload: Partial<TokenInfo> & { mint: string } }
  | { type: 'SET_TRANSACTIONS'; payload: TransactionRecord[] }
  | { type: 'ADD_TRANSACTION'; payload: TransactionRecord }
  | { type: 'UPDATE_TRANSACTION'; payload: Partial<TransactionRecord> & { signature: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_SUCCESS'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_MOBILE_MENU'; payload: boolean }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'CLEAR_MESSAGES' };

export interface StatItem {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    };
    solflare?: {
      isSolflare?: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    };
  }
}