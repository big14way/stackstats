import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface NavbarProps {
  isWalletConnected: boolean;
  onWalletConnect: () => void;
}

export default function Navbar({ isWalletConnected, onWalletConnect }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      onWalletConnect();
    }, 2000);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/90 backdrop-blur-md border-b border-purple-500/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo & Stats */}
          <div className="flex items-center space-x-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <span className="text-white font-bold text-xl">Stack Sats</span>
            </motion.div>

            {/* Stats */}
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-blue-400 font-semibold">4.2%</div>
                <div className="text-gray-400 text-xs">APY</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-semibold">185%</div>
                <div className="text-gray-400 text-xs">CDR</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-semibold">$2.1M</div>
                <div className="text-gray-400 text-xs">TVL</div>
              </div>
            </div>
          </div>

          {/* Right - Wallet Connection */}
          <motion.button
            onClick={handleConnect}
            disabled={isConnecting || isWalletConnected}
            whileHover={{ scale: isWalletConnected ? 1 : 1.05 }}
            whileTap={{ scale: isWalletConnected ? 1 : 0.95 }}
            className={`
              px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2
              ${isWalletConnected 
                ? 'bg-green-600/20 border border-green-500/30 text-green-400' 
                : isConnecting
                ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-500/25'
              }
            `}
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300/30 border-t-gray-300 rounded-full animate-spin" />
                <span>Connecting...</span>
              </>
            ) : isWalletConnected ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Connected</span>
              </>
            ) : (
              <>
                <span>🦊</span>
                <span>Connect Wallet</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
} 