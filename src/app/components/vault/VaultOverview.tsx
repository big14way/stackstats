import { motion } from 'framer-motion';
import { useVaultData } from '../../../hooks/useVaultData';

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

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-600 rounded w-16"></div>
  </div>
);

export default function VaultOverview() {
  const { 
    apy, 
    btcPrice, 
    totalAssets, 
    totalShares, 
    sharePrice, 
    btcPairs, 
    isLoading, 
    error, 
    refresh 
  } = useVaultData();

  // Calculate some derived stats from real data
  const mockVaultStats: VaultStats = {
    btcPrice: btcPrice,
    volatilityIndex: 7.2, // This would come from volatility calculation
    currentCDR: 185,
    depositedBTC: totalAssets,
    borrowedUSDC: totalShares * sharePrice * 50, // Mock calculation
    borrowableUSDC: (totalAssets * btcPrice * 0.6) - (totalShares * sharePrice * 50), // 60% LTV
    liquidationThreshold: totalAssets * 0.8, // 80% threshold
    yieldStrategy: {
      name: btcPairs.length > 0 ? "Ekubo LP" : "Ekubo LP",
      apy: apy,
      nextRebalance: "3 hours",
      autoCompound: true,
    }
  };

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
          className="bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl relative"
        >
          {/* Loading/Error indicator */}
          {isLoading && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          )}
          {error && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" title={error}></div>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Market Data</h3>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">BTC Price</span>
              <span className="font-mono text-lg font-bold text-green-400">
                {isLoading ? <LoadingSkeleton /> : `$${mockVaultStats.btcPrice.toLocaleString()}`}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Volatility (30d)</span>
              <span className="font-mono text-lg font-bold text-yellow-400">
                {isLoading ? <LoadingSkeleton /> : `${mockVaultStats.volatilityIndex}%`}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Dynamic CDR</span>
              <span className="font-mono text-lg font-bold text-blue-400">
                {isLoading ? <LoadingSkeleton /> : `${mockVaultStats.currentCDR}%`}
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
                {isLoading ? <LoadingSkeleton /> : `${mockVaultStats.depositedBTC} wBTC`}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Borrowed</span>
              <span className="font-mono text-lg font-bold text-red-400">
                {isLoading ? <LoadingSkeleton /> : `$${mockVaultStats.borrowedUSDC.toFixed(2)} USDC`}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
              <span className="text-gray-300 font-medium">Available</span>
              <span className="font-mono text-lg font-bold text-purple-400">
                {isLoading ? <LoadingSkeleton /> : `$${mockVaultStats.borrowableUSDC.toFixed(2)} USDC`}
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
                {isLoading ? <LoadingSkeleton /> : `${mockVaultStats.yieldStrategy.apy}%`}
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

      {/* Live Data Information */}
      {btcPairs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 p-4 bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/30"
        >
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Live BTC Pairs from Ekubo ({btcPairs.length} active)
          </h4>
          <div className="flex flex-wrap gap-2">
            {btcPairs.slice(0, 3).map((pair, index) => (
              <div key={index} className="text-xs px-2 py-1 bg-gray-700/50 rounded text-gray-400">
                {pair.token0.symbol}/{pair.token1.symbol}: {(pair.currentApr * 100).toFixed(2)}% APR
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Manual refresh button */}
      <button
        onClick={refresh}
        className="fixed bottom-4 right-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white shadow-lg transition-colors"
        title="Refresh live data"
      >
        <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}
