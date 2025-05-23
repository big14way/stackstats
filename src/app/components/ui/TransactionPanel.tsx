import { motion } from 'framer-motion';
import { useState } from 'react';

interface TransactionPanelProps {
  openModal: (action: 'deposit' | 'withdraw' | 'borrow' | 'repay') => void;
}

type TabType = 'deposit' | 'borrow' | 'repay';

const tabs = [
  {
    id: 'deposit' as const,
    label: 'Deposit',
    icon: '📥',
    description: 'Deposit BTC to start earning yield',
    color: 'blue'
  },
  {
    id: 'borrow' as const,
    label: 'Borrow',
    icon: '💵',
    description: 'Borrow USDC against your BTC',
    color: 'purple'
  },
  {
    id: 'repay' as const,
    label: 'Repay & Withdraw',
    icon: '↩️',
    description: 'Repay loans or withdraw your BTC',
    color: 'green'
  }
];

export default function TransactionPanel({ openModal }: TransactionPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('deposit');
  const [amounts, setAmounts] = useState({
    deposit: '',
    borrow: '',
    repay: ''
  });

  const getColorClasses = (color: string, variant: 'bg' | 'border' | 'text' = 'bg') => {
    const colors = {
      blue: {
        bg: 'bg-blue-600 hover:bg-blue-700',
        border: 'border-blue-500',
        text: 'text-blue-400'
      },
      purple: {
        bg: 'bg-purple-600 hover:bg-purple-700',
        border: 'border-purple-500',
        text: 'text-purple-400'
      },
      green: {
        bg: 'bg-green-600 hover:bg-green-700',
        border: 'border-green-500',
        text: 'text-green-400'
      }
    };
    return colors[color as keyof typeof colors]?.[variant] || '';
  };

  const handleAmountChange = (tab: TabType, value: string) => {
    setAmounts(prev => ({ ...prev, [tab]: value }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'deposit':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                BTC Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amounts.deposit}
                  onChange={(e) => handleAmountChange('deposit', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
                  placeholder="0.00"
                  step="0.00001"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  BTC
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Start earning yield on your Bitcoin deposits
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Deposit Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated APY:</span>
                  <span className="text-green-400">4.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Strategy:</span>
                  <span>Ekubo LP</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openModal('deposit')}
              className={`w-full ${getColorClasses('blue')} text-white font-bold py-3 px-4 rounded-lg transition-colors`}
            >
              Deposit BTC
            </button>
          </div>
        );

      case 'borrow':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                USDC Amount to Borrow
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amounts.borrow}
                  onChange={(e) => handleAmountChange('borrow', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-16"
                  placeholder="0.00"
                  step="0.01"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  USDC
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Maximum borrowable: $38.25 USDC
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Borrow Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Required CDR:</span>
                  <span className="text-purple-400">150%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Interest Rate:</span>
                  <span>5.8% APR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Liquidation Risk:</span>
                  <span className="text-green-400">Low</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openModal('borrow')}
              className={`w-full ${getColorClasses('purple')} text-white font-bold py-3 px-4 rounded-lg transition-colors`}
            >
              Borrow USDC
            </button>
          </div>
        );

      case 'repay':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Repay USDC
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amounts.repay}
                    onChange={(e) => handleAmountChange('repay', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-16"
                    placeholder="0.00"
                    step="0.01"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    USDC
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Outstanding debt: $120 USDC
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Withdraw BTC
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-16"
                    placeholder="0.00"
                    step="0.00001"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    BTC
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Available to withdraw: 0.003 BTC
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Position Health</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current CDR:</span>
                  <span className="text-green-400">185%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Safe CDR:</span>
                  <span className="text-green-400">&gt; 150%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => openModal('repay')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Repay USDC
              </button>
              <button
                onClick={() => openModal('withdraw')}
                className={`${getColorClasses('green')} text-white font-bold py-3 px-4 rounded-lg transition-colors`}
              >
                Withdraw BTC
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transaction Panel
          </h2>
          <p className="text-gray-300">
            Manage your vault position with our intuitive transaction interface
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-left transition-colors relative ${
                  activeTab === tab.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{tab.icon}</span>
                  <div>
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs text-gray-500">{tab.description}</div>
                  </div>
                </div>
                
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-1 ${getColorClasses(tab.color)}`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 