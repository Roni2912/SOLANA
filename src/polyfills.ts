// Polyfills for Solana Web3.js browser compatibility
import { Buffer } from 'buffer'
import process from 'process'

// Attach to window object immediately
if (typeof window !== 'undefined') {
  (window as any).global = window
  window.Buffer = Buffer
  window.process = process
  
  // Ensure process.env exists
  if (!window.process.env) {
    window.process.env = {}
  }
}

// Also attach to global scope
if (typeof global !== 'undefined') {
  (global as any).Buffer = Buffer
  global.process = process
}

export { Buffer, process }