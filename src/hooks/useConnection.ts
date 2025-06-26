import { Connection, clusterApiUrl } from '@solana/web3.js';

export const useConnection = () => {
  return new Connection(clusterApiUrl('devnet'), 'confirmed');
};