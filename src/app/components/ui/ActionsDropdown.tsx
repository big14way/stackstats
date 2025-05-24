import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ActionsDropdownProps {
  onActionClick: (action: 'deposit' | 'withdraw' | 'borrow' | 'repay') => void;
}

const actions = [
  {
    id: 'deposit' as const,
    label: 'Deposit',
    icon: '↗',
    description: 'Add BTC to vault',
    color: 'text-blue-400 hover:text-blue-300'
  },
  {
    id: 'withdraw' as const,
    label: 'Withdraw',
    icon: '↙',
    description: 'Get BTC from vault',
    color: 'text-emerald-400 hover:text-emerald-300'
  },
  {
    id: 'borrow' as const,
    label: 'Borrow',
    icon: '⟲',
    description: 'Get USDC against BTC',
    color: 'text-purple-400 hover:text-purple-300'
  },
  {
    id: 'repay' as const,
    label: 'Repay',
    icon: '⟳',
    description: 'Pay back USDC',
    color: 'text-rose-400 hover:text-rose-300'
  }
];

export default function ActionsDropdown({ onActionClick }: ActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleActionClick = (action: 'deposit' | 'withdraw' | 'borrow' | 'repay') => {
    onActionClick(action);
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-xs font-bold text-white"
        >
          {isOpen ? '×' : '◐'}
        </motion.div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-400/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
      </motion.button>

      {/* Tiny "click me" text */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="mt-1"
      >
        <span className="text-xs text-gray-400/70 font-light">click me</span>
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="absolute top-0 left-10 z-50 w-64 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                <h3 className="text-sm font-semibold text-white">Vault Actions</h3>
                <p className="text-xs text-gray-400">Choose what you'd like to do</p>
              </div>

              {/* Actions List */}
              <div className="py-2">
                {actions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    onClick={() => handleActionClick(action.id)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(75, 85, 99, 0.2)' }}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-700/30 transition-all duration-200 group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center text-lg font-bold ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                      {action.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white group-hover:text-blue-100 transition-colors">
                        {action.label}
                      </div>
                      <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                        {action.description}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-gray-900/50 border-t border-gray-700/50">
                <p className="text-xs text-gray-500 text-center">
                  Powered by Starknet & Pragma
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 