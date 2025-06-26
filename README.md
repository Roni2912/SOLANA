# SolanaTokenHub - Professional Token Management Platform

A modern, full-featured React application for creating, minting, and managing SPL tokens on the Solana blockchain. Built with TypeScript, Tailwind CSS, and modern React patterns for professional-grade blockchain development.

## 🌟 Key Features

### 🔗 Wallet Integration
- **Multi-Wallet Support**: Phantom and Solflare wallet integration
- **Persistent Sessions**: Wallet state persists across browser refreshes
- **Real-time Balance**: Live SOL and token balance updates
- **Secure Connection**: Non-custodial wallet integration

### 🚀 Token Operations
- **Create Custom Tokens**: Deploy SPL tokens with custom parameters
- **Mint Additional Supply**: Increase token circulation securely
- **Transfer Tokens**: Send tokens to any Solana address
- **Portfolio Management**: Comprehensive token holdings overview

### 📊 Analytics & Monitoring
- **Real-time Dashboard**: Live metrics and key performance indicators
- **Transaction History**: Complete blockchain activity log
- **Balance Monitoring**: Automatic SOL and token balance updates
- **Portfolio Analytics**: Comprehensive token portfolio overview

### 🎨 User Experience
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Fully Responsive**: Optimized for desktop, tablet, and mobile
- **Interactive Feedback**: Loading states and real-time notifications
- **Error Handling**: Comprehensive error management and recovery

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/Roni2912/solana-token-hub.git
cd SOLANA
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` and connect your Phantom wallet to get started!

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Blockchain**: Solana Web3.js + SPL Token Program
- **Build Tool**: Vite
- **State Management**: React Context + useReducer
- **Icons**: Lucide React

## 📋 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Phantom Wallet browser extension
- Basic understanding of Solana blockchain

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd solana-token-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── features/        # Feature-specific components
│   │   ├── wallet/      # Wallet-related components
│   │   ├── token/       # Token management components
│   │   └── transaction/ # Transaction components
│   ├── AlertSystem.tsx  # Global alert system
│   └── Footer.tsx       # Application footer
├── contexts/            # React contexts
│   └── AppContext.tsx   # Main application context
├── hooks/               # Custom React hooks
│   ├── useConnection.ts # Solana connection hook
│   ├── useWalletOperations.ts # Wallet operations
│   └── useTokenOperations.ts  # Token operations
├── types/               # TypeScript type definitions
│   └── index.ts         # All application types
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## Key Components

### Wallet Management
- **Header**: Navigation with wallet connection status
- **WalletConnection**: Wallet connection interface
- **StatsDashboard**: Real-time metrics and quick actions

### Token Operations
- **TokenCreator**: Create new SPL tokens
- **TokenMinter**: Mint additional token supply
- **TokenTransfer**: Send tokens to other addresses
- **TokenPortfolio**: View and manage token holdings

### Transaction System
- **TransactionHistory**: Complete transaction log
- **AlertSystem**: Real-time notifications

## Usage Guide

### Connecting Your Wallet

1. Install Phantom Wallet browser extension
2. Create or import a wallet
3. Switch to Solana Devnet in Phantom settings
4. Click "Connect Wallet" in the application
5. Approve the connection in Phantom

### Getting Devnet SOL

1. Use the "Request Airdrop" button for 1 SOL
2. Visit the Solana Faucet for additional SOL
3. Ensure you have sufficient SOL for transaction fees

### Creating a Token

1. Fill in token details (name, symbol, decimals, supply)
2. Click "Create Token"
3. Approve the transaction in Phantom
4. Your new token will appear in your portfolio

### Minting Tokens

1. Select an existing token from the dropdown
2. Enter the amount to mint
3. Click "Mint Tokens"
4. Confirm the transaction

### Transferring Tokens

1. Select the token to transfer
2. Enter the recipient's Solana address
3. Specify the amount
4. Click "Transfer Tokens"
5. Confirm in Phantom

## Security Features

- **Non-custodial**: Your keys remain in your wallet
- **Devnet Environment**: Safe testing environment
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Graceful error management
- **Transaction Verification**: All transactions are verified

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

## Environment Setup

The application is configured for Solana Devnet by default. To switch networks:

1. Update the cluster in `src/hooks/useConnection.ts`
2. Change from `'devnet'` to `'mainnet-beta'` for production
3. **Warning**: Only use mainnet for production applications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

**Wallet won't connect**
- Ensure Phantom is installed and unlocked
- Check that you're on the correct network (Devnet)
- Try refreshing the page

**Transaction fails**
- Verify sufficient SOL balance for fees
- Check network connection
- Ensure proper token permissions

**Build errors**
- Clear node_modules and reinstall
- Check Node.js version (18+)
- Verify all dependencies are installed

## Learning Resources

- [Solana Documentation](https://docs.solana.com)
- [SPL Token Program](https://spl.solana.com/token)
- [Phantom Wallet](https://phantom.app)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://typescriptlang.org)

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show Your Support

Give a ⭐️ if this project helped you learn Solana development!

---

**Built with ❤️ for the Solana ecosystem**