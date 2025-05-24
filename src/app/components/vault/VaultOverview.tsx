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

export default function VaultOverview() {
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
    </div>
  );
}
