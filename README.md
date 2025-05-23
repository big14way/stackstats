# Stack Sats Smarter - Vault Manager

A modern, interactive vault manager built for the Starknet hackathon. This DeFi application allows users to deposit Bitcoin, earn yield, and borrow USDC with dynamic risk protection.

## 🚀 Features

### Core Functionality
- **Bitcoin Deposits**: Deposit BTC to start earning yield automatically
- **USDC Borrowing**: Borrow USDC against your Bitcoin collateral
- **Dynamic CDR Protection**: Smart contracts automatically adjust collateral ratios based on market volatility
- **Yield Strategies**: Automated yield generation through Ekubo LP and other DeFi protocols

### User Experience
- **Interactive Guide**: Animated step-by-step guide showing users how to use the platform
- **Real-time Analytics**: Live charts showing BTC price history and CDR comparisons
- **Transaction Panel**: Intuitive interface for deposits, borrowing, and repayments
- **Educational Modals**: Comprehensive guides for each action with benefits and important notes

### Technical Features
- **Starknet Integration**: Built on Starknet for fast, low-cost transactions
- **Pragma Oracles**: Real-time price feeds for accurate market data
- **Vesu Protocol**: Lending and borrowing functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Blockchain**: Starknet, Starknet React
- **Oracles**: Pragma
- **Lending**: Vesu Protocol

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web3-projects
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── HeroSection.tsx      # Landing page hero
│   │   │   ├── Navbar.tsx           # Navigation bar
│   │   │   ├── AboutSection.tsx     # About the platform
│   │   │   ├── AnimatedGuide.tsx    # Interactive guide
│   │   │   ├── TransactionPanel.tsx # Transaction interface
│   │   │   └── ChartPanel.tsx       # Analytics charts
│   │   ├── vault/
│   │   │   └── VaultOverview.tsx    # Vault statistics
│   │   └── modals/
│   │       └── ActionModal.tsx      # Transaction modals
│   ├── page.tsx                     # Main page
│   ├── layout.tsx                   # App layout
│   └── globals.css                  # Global styles
└── lib/                             # Utility functions
```

## 🎯 Key Components

### Hero Section
- Eye-catching landing with animated background
- Wallet connection functionality
- Key metrics display (APY, CDR, TVL)

### Interactive Guide
- 4-step animated guide showing the platform workflow
- Clickable elements that trigger educational modals
- Visual connections between steps

### Vault Overview
- Real-time vault statistics
- User position information
- Quick action buttons for all operations

### Transaction Panel
- Tabbed interface for different operations
- Input validation and transaction details
- Real-time calculations and risk indicators

### Chart Panel
- BTC price history visualization
- Dynamic vs Fixed CDR comparison
- Educational content about risk protection

### Action Modals
- Dual-mode: Transaction and Guide modes
- Step-by-step instructions for each action
- Benefits and important notes for user education

## 🔧 Configuration

The application uses mock data for demonstration purposes. In a production environment, you would:

1. Connect to actual Starknet contracts
2. Integrate with Pragma oracles for real price feeds
3. Connect to Vesu protocol for lending functionality
4. Implement proper wallet connection with Starknet React

## 🎨 Design Philosophy

- **User-First**: Every interaction is designed to be intuitive and educational
- **Modern Aesthetics**: Clean, gradient-based design with smooth animations
- **Responsive**: Works perfectly on all device sizes
- **Educational**: Built-in guides and explanations for DeFi newcomers

## 🚀 Deployment

To build for production:

```bash
npm run build
npm start
```

## 📝 License

This project is built for the Starknet hackathon and is open source.

## 🤝 Contributing

This is a hackathon project, but contributions and feedback are welcome!

## 📞 Support

For questions or support, please reach out to the development team.

---

Built with ❤️ for the Starknet ecosystem
