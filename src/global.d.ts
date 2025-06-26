import { Buffer } from 'buffer';
import { Process } from 'process';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: Process;
    global: typeof globalThis;
    solana?: any;
    solflare?: any;
  }
  
  var Buffer: typeof Buffer;
  var process: Process;
  var global: typeof globalThis;
}

export {};