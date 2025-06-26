import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  Keypair,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getMint,
  getAccount,
} from '@solana/spl-token';

// Connection to Solana network
export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Get SOL balance
export const getSolBalance = async (publicKey: PublicKey): Promise<number> => {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching SOL balance:', error);
    throw error;
  }
};

// Get token balance
export const getTokenBalance = async (
  ownerPublicKey: PublicKey,
  mintPublicKey: PublicKey
): Promise<number> => {
  try {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      Keypair.generate(), // This is just for calculation, not signing
      mintPublicKey,
      ownerPublicKey,
      false // Don't create if doesn't exist, just calculate address
    );
    
    const accountInfo = await getAccount(connection, tokenAccount.address);
    return Number(accountInfo.amount);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
};

// Create a new SPL token
export const createSPLToken = async (
  wallet: any,
  decimals: number = 9
): Promise<PublicKey> => {
  try {
    const mintKeypair = Keypair.generate();
    
    const mint = await createMint(
      connection,
      wallet, // Payer
      wallet.publicKey, // Mint authority
      wallet.publicKey, // Freeze authority
      decimals,
      mintKeypair
    );
    
    return mint;
  } catch (error) {
    console.error('Error creating SPL token:', error);
    throw error;
  }
};

// Mint tokens to an account
export const mintSPLTokens = async (
  wallet: any,
  mintPublicKey: PublicKey,   
  amount: number,
  decimals: number = 9
): Promise<string> => {
  try {
    // Get or create associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet, // Payer
      mintPublicKey,
      wallet.publicKey // Owner
    );
    
    // Mint tokens
    const signature = await mintTo(
      connection,
      wallet, // Payer
      mintPublicKey,
      tokenAccount.address,
      wallet.publicKey, // Mint authority
      amount * Math.pow(10, decimals)
    );
    
    return signature;
  } catch (error) {
    console.error('Error minting tokens:', error);
    throw error;
  }
};

// Transfer tokens
export const transferSPLTokens = async (
  wallet: any,
  mintPublicKey: PublicKey,
  recipientPublicKey: PublicKey,
  amount: number,
  decimals: number = 9
): Promise<string> => {
  try {
    // Get sender's token account
    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mintPublicKey,
      wallet.publicKey
    );
    
    // Get or create recipient's token account
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet, // Payer for creation
      mintPublicKey,
      recipientPublicKey
    );
    
    // Transfer tokens
    const signature = await transfer(
      connection,
      wallet, // Payer
      senderTokenAccount.address,
      recipientTokenAccount.address,
      wallet.publicKey, // Owner
      amount * Math.pow(10, decimals)
    );
    
    return signature;
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

// Get transaction details
export const getTransactionDetails = async (signature: string) => {
  try {
    const transaction = await connection.getTransaction(signature, {
      commitment: 'confirmed'
    });
    return transaction;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};

// Get token mint info
export const getTokenMintInfo = async (mintPublicKey: PublicKey) => {
  try {
    const mintInfo = await getMint(connection, mintPublicKey);
    return mintInfo;
  } catch (error) {
    console.error('Error fetching mint info:', error);
    throw error;
  }
};

// Validate Solana address
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Request airdrop for testing (Devnet only)
export const requestAirdrop = async (publicKey: PublicKey): Promise<string> => {
  try {
    const signature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL // 1 SOL
    );
    
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Error requesting airdrop:', error);
    throw error;
  }
};