import { motion } from 'framer-motion';
import { useProtocolStats } from '../../../hooks/useProtocolStats';

export default function TopStats() {
  const { apy, tvl, cdr, isLoading, error, refresh } = useProtocolStats();

  // Format TVL for display
  const formatTvl = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Show loading spinner for individual stats when loading
  const StatValue = ({ value, suffix, isLoading }: { value: string | number, suffix?: string, isLoading: boolean }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></div>
        </div>
      );
    }
    return <>{value}{suffix}</>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex justify-center py-6"
    >
      <div className="flex items-center space-x-8 px-8 py-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 relative">
        {/* Refresh indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"
          />
        )}
        
        {/* Error indicator */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"
            title={`Error: ${error}`}
          />
        )}

        <div className="text-center">
          <div className="text-blue-400 font-bold text-2xl">
            <StatValue value={`${apy}%`} isLoading={isLoading} />
          </div>
          <div className="text-gray-400 text-sm">APY</div>
        </div>
        
        <div className="w-px h-8 bg-gray-600"></div>
        
        <div className="text-center">
          <div className="text-green-400 font-bold text-2xl">
            <StatValue value={`${cdr}%`} isLoading={isLoading} />
          </div>
          <div className="text-gray-400 text-sm">CDR</div>
        </div>
        
        <div className="w-px h-8 bg-gray-600"></div>
        
        <div className="text-center">
          <div className="text-purple-400 font-bold text-2xl">
            <StatValue value={formatTvl(tvl)} isLoading={isLoading} />
          </div>
          <div className="text-gray-400 text-sm">TVL</div>
        </div>

        {/* Manual refresh button (hidden, triggered by clicking the whole component) */}
        <button
          onClick={refresh}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Click to refresh data"
        />
      </div>
    </motion.div>
  );
} 