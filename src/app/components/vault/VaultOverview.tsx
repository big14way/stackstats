import { motion } from 'framer-motion';

interface VaultStats {
  btcPrice: number;
  volatilityIndex: number;
  currentCDR: number;
  depositedBTC: number;
  borrowedUSDC: number;
  borrowableUSDC: number;
  liquidationThreshold: number;
  yieldStrategy: {
    name: string;
    apy: number;
    nextRebalance: string;
    autoCompound: boolean;
  };
}

// Mock data - will be replaced with real data from the smart contract
const mockVaultStats: VaultStats = {
  btcPrice: 42000,
  volatilityIndex: 7.2,
  currentCDR: 185,
  depositedBTC: 0.015,
  borrowedUSDC: 120,
  borrowableUSDC: 38.25,
  liquidationThreshold: 0.0132,
  yieldStrategy: {
    name: "Ekubo LP",
    apy: 4.2,
    nextRebalance: "3 hours",
    autoCompound: true,
  }
};

interface VaultOverviewProps {
  openModal: (action: 'deposit' | 'withdraw' | 'borrow' | 'repay') => void;
}

export default function VaultOverview({ openModal }: VaultOverviewProps) {
  const actions = [
    {
      id: 'deposit' as const,
      label: 'Deposit',
      icon: '↗',
      description: 'Add BTC',
      gradient: 'from-blue-500/20 via-blue-600/30 to-blue-700/20',
      border: 'border-blue-400/30',
      glow: 'hover:shadow-blue-400/20',
      text: 'text-blue-100',
      hoverGradient: 'hover:from-blue-400/30 hover:via-blue-500/40 hover:to-blue-600/30'
    },
    {
      id: 'withdraw' as const,
      label: 'Withdraw',
      icon: '↙',
      description: 'Get BTC',
      gradient: 'from-emerald-500/20 via-emerald-600/30 to-emerald-700/20',
      border: 'border-emerald-400/30',
      glow: 'hover:shadow-emerald-400/20',
      text: 'text-emerald-100',
      hoverGradient: 'hover:from-emerald-400/30 hover:via-emerald-500/40 hover:to-emerald-600/30'
    },
    {
      id: 'borrow' as const,
      label: 'Borrow',
      icon: '⟲',
      description: 'Get USDC',
      gradient: 'from-purple-500/20 via-purple-600/30 to-purple-700/20',
      border: 'border-purple-400/30',
      glow: 'hover:shadow-purple-400/20',
      text: 'text-purple-100',
      hoverGradient: 'hover:from-purple-400/30 hover:via-purple-500/40 hover:to-purple-600/30'
    },
    {
      id: 'repay' as const,
      label: 'Repay',
      icon: '⟳',
      description: 'Pay USDC',
      gradient: 'from-rose-500/20 via-rose-600/30 to-rose-700/20',
      border: 'border-rose-400/30',
      glow: 'hover:shadow-rose-400/20',
      text: 'text-rose-100',
      hoverGradient: 'hover:from-rose-400/30 hover:via-rose-500/40 hover:to-rose-600/30'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Vault Stats Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Market Data</h3>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">BTC Price</span>
              <span className="font-mono text-lg font-bold text-green-400">
                ${mockVaultStats.btcPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Volatility (30d)</span>
              <span className="font-mono text-lg font-bold text-yellow-400">
                {mockVaultStats.volatilityIndex}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Dynamic CDR</span>
              <span className="font-mono text-lg font-bold text-blue-400">
                {mockVaultStats.currentCDR}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Your Position Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Your Position</h3>
            <div className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded-full border border-green-500/30">
              Healthy
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Deposited</span>
              <span className="font-mono text-lg font-bold text-orange-400">
                {mockVaultStats.depositedBTC} wBTC
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Borrowed</span>
              <span className="font-mono text-lg font-bold text-red-400">
                ${mockVaultStats.borrowedUSDC} USDC
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Available</span>
              <span className="font-mono text-lg font-bold text-purple-400">
                ${mockVaultStats.borrowableUSDC} USDC
              </span>
            </div>
          </div>
        </motion.div>

        {/* Yield Strategy Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Yield Strategy</h3>
            <div className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30">
              Active
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Strategy</span>
              <span className="font-bold text-white">
                {mockVaultStats.yieldStrategy.name}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Current APY</span>
              <span className="font-mono text-lg font-bold text-green-400">
                {mockVaultStats.yieldStrategy.apy}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Next Rebalance</span>
              <span className="font-medium text-gray-300">
                {mockVaultStats.yieldStrategy.nextRebalance}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Sleek Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            onClick={() => openModal(action.id)}
            whileHover={{ 
              scale: 1.02, 
              y: -4,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`
              group relative overflow-hidden rounded-2xl p-6 transition-all duration-300
              bg-gradient-to-br ${action.gradient} ${action.hoverGradient}
              backdrop-blur-sm border ${action.border}
              shadow-xl ${action.glow} hover:shadow-2xl
              hover:border-opacity-50
            `}
          >
            {/* Background blur effect */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm
                flex items-center justify-center text-2xl font-bold
                ${action.text} group-hover:bg-white/15 transition-all duration-300
                group-hover:scale-110
              `}>
                {action.icon}
              </div>
              
              {/* Label */}
              <div>
                <div className={`font-bold text-lg ${action.text} group-hover:text-white transition-colors duration-300`}>
                  {action.label}
                </div>
                <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {action.description}
                </div>
              </div>
            </div>

            {/* Subtle animated border glow */}
            <div className={`
              absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
              bg-gradient-to-r ${action.gradient} blur-sm -z-10
              transition-opacity duration-300
            `}></div>

            {/* Glass reflection effect */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
