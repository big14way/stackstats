import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

type ActionType = 'deposit' | 'withdraw' | 'borrow' | 'repay';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: ActionType;
  isGuideMode?: boolean;
}

export default function ActionModal({ isOpen, onClose, action, isGuideMode = false }: ActionModalProps) {
  const actionConfig = {
    deposit: {
      title: 'Deposit BTC',
      description: 'Deposit your BTC to earn yield',
      inputLabel: 'Amount (BTC)',
      buttonText: 'Deposit',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      guide: {
        steps: [
          'Connect your Starknet wallet',
          'Enter the amount of BTC you want to deposit',
          'Approve the transaction',
          'Your BTC will start earning yield automatically'
        ],
        benefits: [
          '📈 Earn 4.2% APY on your Bitcoin',
          '🔄 Auto-compound your earnings',
          '🛡️ Dynamic risk protection'
        ]
      }
    },
    withdraw: {
      title: 'Withdraw BTC',
      description: 'Withdraw your deposited BTC',
      inputLabel: 'Amount (BTC)',
      buttonText: 'Withdraw',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      guide: {
        steps: [
          'Ensure your position is healthy (CDR > 150%)',
          'Enter the amount you want to withdraw',
          'Confirm the transaction',
          'BTC will be sent to your wallet'
        ],
        benefits: [
          '⚡ Instant withdrawals',
          '🔒 Maintain healthy collateral ratio',
          '💰 Keep earned yield'
        ]
      }
    },
    borrow: {
      title: 'Borrow USDC',
      description: 'Borrow USDC against your BTC',
      inputLabel: 'Amount (USDC)',
      buttonText: 'Borrow',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      guide: {
        steps: [
          'Deposit BTC as collateral first',
          'Enter the USDC amount to borrow',
          'Ensure CDR stays above 150%',
          'Receive USDC in your wallet'
        ],
        benefits: [
          '💵 Access liquidity without selling BTC',
          '📊 Dynamic CDR protection',
          '🔄 Flexible repayment terms'
        ]
      }
    },
    repay: {
      title: 'Repay USDC',
      description: 'Repay your borrowed USDC',
      inputLabel: 'Amount (USDC)',
      buttonText: 'Repay',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      guide: {
        steps: [
          'Check your outstanding debt',
          'Enter repayment amount',
          'Approve USDC spending',
          'Your debt will be reduced'
        ],
        benefits: [
          '📉 Reduce liquidation risk',
          '💰 Lower interest payments',
          '🔓 Unlock more borrowing capacity'
        ]
      }
    },
  };

  const config = actionConfig[action];

  const renderGuideContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-blue-400 mb-2">📚 How to {config.title}</h3>
          <ol className="space-y-2">
            {config.guide.steps.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-300">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-green-400 mb-2">✨ Benefits</h3>
          <ul className="space-y-2">
            {config.guide.benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-gray-300">{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Important Notes</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            {action === 'deposit' && (
              <>
                <li>• Minimum deposit: 0.001 BTC</li>
                <li>• Your BTC will be automatically invested in yield strategies</li>
              </>
            )}
            {action === 'borrow' && (
              <>
                <li>• Maintain CDR above 150% to avoid liquidation</li>
                <li>• Interest rate: 5.8% APR</li>
              </>
            )}
            {action === 'withdraw' && (
              <>
                <li>• Ensure sufficient collateral remains after withdrawal</li>
                <li>• You can withdraw earned yield anytime</li>
              </>
            )}
            {action === 'repay' && (
              <>
                <li>• Partial repayments are allowed</li>
                <li>• Repaying improves your position health</li>
              </>
            )}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Got it! Close Guide
        </button>
      </div>
    );
  };

  const renderTransactionContent = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {config.inputLabel}
          </label>
          <input
            type="number"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="0.00001"
          />
        </div>

        {/* Transaction details */}
        <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Network Fee:</span>
            <span>~$2.50</span>
          </div>
          {action === 'borrow' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Interest Rate:</span>
                <span>5.8% APR</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Required CDR:</span>
                <span className="text-purple-400">150%</span>
              </div>
            </>
          )}
          {action === 'deposit' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Expected APY:</span>
              <span className="text-green-400">4.2%</span>
            </div>
          )}
        </div>

        <button
          className={`w-full ${config.buttonColor} text-white font-bold py-3 px-4 rounded-lg transition-colors`}
        >
          {config.buttonText}
        </button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative bg-gray-800 rounded-2xl p-6 w-full shadow-xl ${
              isGuideMode ? 'max-w-2xl' : 'max-w-md'
            }`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2 mb-2">
              {isGuideMode && <span className="text-xl">📚</span>}
              <h2 className="text-2xl font-bold text-white">
                {isGuideMode ? `Guide: ${config.title}` : config.title}
              </h2>
            </div>
            
            <p className="text-gray-400 mb-6">
              {isGuideMode 
                ? `Learn how to ${config.description.toLowerCase()}`
                : config.description
              }
            </p>

            {isGuideMode ? renderGuideContent() : renderTransactionContent()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
