import { motion } from 'framer-motion';
import { useState } from 'react';

// Mock data for the charts
const mockBTCPriceData = [
  { time: '7d ago', price: 38500, volume: 2.4 },
  { time: '6d ago', price: 39200, volume: 3.1 },
  { time: '5d ago', price: 40100, volume: 2.8 },
  { time: '4d ago', price: 41200, volume: 3.5 },
  { time: '3d ago', price: 40800, volume: 2.9 },
  { time: '2d ago', price: 41800, volume: 3.2 },
  { time: '1d ago', price: 42200, volume: 2.7 },
  { time: 'Now', price: 42000, volume: 3.0 }
];

const mockCDRData = [
  { time: '7d ago', dynamic: 180, fixed: 150 },
  { time: '6d ago', dynamic: 175, fixed: 150 },
  { time: '5d ago', dynamic: 185, fixed: 150 },
  { time: '4d ago', dynamic: 190, fixed: 150 },
  { time: '3d ago', dynamic: 188, fixed: 150 },
  { time: '2d ago', dynamic: 182, fixed: 150 },
  { time: '1d ago', dynamic: 187, fixed: 150 },
  { time: 'Now', dynamic: 185, fixed: 150 }
];

type ChartType = 'price' | 'cdr';

export default function ChartPanel() {
  const [activeChart, setActiveChart] = useState<ChartType>('price');

  const maxPrice = Math.max(...mockBTCPriceData.map(d => d.price));
  const minPrice = Math.min(...mockBTCPriceData.map(d => d.price));
  const priceRange = maxPrice - minPrice;

  const maxCDR = Math.max(...mockCDRData.map(d => Math.max(d.dynamic, d.fixed)));
  const minCDR = Math.min(...mockCDRData.map(d => Math.min(d.dynamic, d.fixed)));
  const cdrRange = maxCDR - minCDR || 1;

  const getPathData = (data: any[], key: string, range: number, min: number) => {
    const width = 100; // Percentage width
    const height = 60; // Percentage height
    
    return data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((point[key] - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const renderPriceChart = () => {
    const pathData = getPathData(mockBTCPriceData, 'price', priceRange, minPrice);
    
    return (
      <div className="space-y-6">
        <div className="relative h-64 bg-gray-800/50 rounded-lg p-4">
          <div className="absolute top-4 left-4">
            <h4 className="font-semibold text-lg">BTC Price (7d)</h4>
            <p className="text-2xl font-bold text-green-400">
              ${mockBTCPriceData[mockBTCPriceData.length - 1].price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">
              +{((mockBTCPriceData[mockBTCPriceData.length - 1].price - mockBTCPriceData[0].price) / mockBTCPriceData[0].price * 100).toFixed(2)}%
            </p>
          </div>
          
          <svg
            viewBox="0 0 100 60"
            className="absolute inset-4 w-auto h-auto"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Price area */}
            <path
              d={`${pathData} L 100 60 L 0 60 Z`}
              fill="url(#priceGradient)"
            />
            
            {/* Price line */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="#10B981"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Data points */}
            {mockBTCPriceData.map((point, index) => (
              <motion.circle
                key={index}
                cx={(index / (mockBTCPriceData.length - 1)) * 100}
                cy={60 - ((point.price - minPrice) / priceRange) * 60}
                r="0.8"
                fill="#10B981"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:r-1.5 transition-all cursor-pointer"
              />
            ))}
          </svg>
        </div>

        {/* Price data table */}
        <div className="grid grid-cols-4 gap-4">
          {mockBTCPriceData.slice(-4).map((point, index) => (
            <div key={index} className="bg-gray-800/30 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">{point.time}</p>
              <p className="font-semibold">${point.price.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Vol: {point.volume}B</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCDRChart = () => {
    const dynamicPath = getPathData(mockCDRData, 'dynamic', cdrRange, minCDR);
    const fixedPath = getPathData(mockCDRData, 'fixed', cdrRange, minCDR);
    
    return (
      <div className="space-y-6">
        <div className="relative h-64 bg-gray-800/50 rounded-lg p-4">
          <div className="absolute top-4 left-4">
            <h4 className="font-semibold text-lg">CDR Comparison</h4>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Dynamic CDR</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-sm">Fixed CDR</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 text-right">
            <p className="text-2xl font-bold text-blue-400">
              {mockCDRData[mockCDRData.length - 1].dynamic}%
            </p>
            <p className="text-sm text-gray-400">Current Dynamic</p>
          </div>
          
          <svg
            viewBox="0 0 100 60"
            className="absolute inset-4 w-auto h-auto"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 20, 40, 60].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#374151"
                strokeWidth="0.2"
                opacity="0.5"
              />
            ))}
            
            {/* Fixed CDR line */}
            <motion.path
              d={fixedPath}
              fill="none"
              stroke="#EF4444"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Dynamic CDR line */}
            <motion.path
              d={dynamicPath}
              fill="none"
              stroke="#60A5FA"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            />
            
            {/* Dynamic CDR points */}
            {mockCDRData.map((point, index) => (
              <motion.circle
                key={`dynamic-${index}`}
                cx={(index / (mockCDRData.length - 1)) * 100}
                cy={60 - ((point.dynamic - minCDR) / cdrRange) * 60}
                r="0.8"
                fill="#60A5FA"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
              />
            ))}
          </svg>
        </div>

        {/* Educational content */}
        <div className="bg-gray-800/30 rounded-lg p-4">
          <h5 className="font-semibold mb-2">📚 Educational: CDR Protection</h5>
          <p className="text-sm text-gray-400 mb-2">
            Our dynamic CDR adjusts automatically based on market volatility, providing better protection than fixed ratios.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-blue-400">Dynamic CDR:</span> Adjusts to market conditions
            </div>
            <div>
              <span className="text-red-400">Fixed CDR:</span> Static 150% requirement
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Market Analytics
          </h2>
          <p className="text-gray-300">
            Real-time market data and risk analysis to help you make informed decisions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Chart selector */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveChart('price')}
              className={`flex-1 px-6 py-4 text-center transition-colors relative ${
                activeChart === 'price'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              <div className="font-medium">BTC Price History</div>
              <div className="text-xs text-gray-500">7-day price movement</div>
              
              {activeChart === 'price' && (
                <motion.div
                  layoutId="activeChart"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"
                />
              )}
            </button>
            
            <button
              onClick={() => setActiveChart('cdr')}
              className={`flex-1 px-6 py-4 text-center transition-colors relative ${
                activeChart === 'cdr'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              <div className="font-medium">CDR Analysis</div>
              <div className="text-xs text-gray-500">Dynamic vs Fixed CDR</div>
              
              {activeChart === 'cdr' && (
                <motion.div
                  layoutId="activeChart"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                />
              )}
            </button>
          </div>

          {/* Chart content */}
          <div className="p-8">
            <motion.div
              key={activeChart}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeChart === 'price' ? renderPriceChart() : renderCDRChart()}
            </motion.div>
          </div>
        </motion.div>

        {/* Key metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">Market Data</h3>
            <p className="text-sm text-gray-400">Powered by Pragma oracles</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <h3 className="font-semibold mb-1">Risk Protection</h3>
            <p className="text-sm text-gray-400">Dynamic liquidation protection</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Real-time Updates</h3>
            <p className="text-sm text-gray-400">Live market monitoring</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 