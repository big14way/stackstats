import { motion } from 'framer-motion';

export default function TopStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex justify-center py-6"
    >
      <div className="flex items-center space-x-8 px-8 py-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50">
        <div className="text-center">
          <div className="text-blue-400 font-bold text-2xl">4.2%</div>
          <div className="text-gray-400 text-sm">APY</div>
        </div>
        <div className="w-px h-8 bg-gray-600"></div>
        <div className="text-center">
          <div className="text-green-400 font-bold text-2xl">185%</div>
          <div className="text-gray-400 text-sm">CDR</div>
        </div>
        <div className="w-px h-8 bg-gray-600"></div>
        <div className="text-center">
          <div className="text-purple-400 font-bold text-2xl">$2.1M</div>
          <div className="text-gray-400 text-sm">TVL</div>
        </div>
      </div>
    </motion.div>
  );
} 