import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';

interface NavbarProps {
  isWalletConnected: boolean;
  onWalletConnect: () => void;
}

export default function Navbar({ isWalletConnected, onWalletConnect }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Starknet-react hooks
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update parent state when connection changes
  useEffect(() => {
    if (address && !isWalletConnected) {
      onWalletConnect();
    }
  }, [address, isWalletConnected, onWalletConnect]);

  const handleConnect = async () => {
    if (!isClient || connectors.length === 0) {
      // Fallback for when connectors aren't loaded yet
      setIsConnecting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onWalletConnect();
      setIsConnecting(false);
      return;
    }

    setIsConnecting(true);
    
    try {
      // Use the first available connector (should be Cartridge)
      await connect({ connector: connectors[0] });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const isConnected = !!address;

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
          <div className="flex items-center space-x-3">
            {isClient && address && (
              <div className="hidden md:flex items-center text-sm text-gray-300">
                <span className="truncate max-w-32">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
            )}
            
            <motion.button
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={isConnecting}
              whileHover={{ scale: isConnected ? 1 : 1.05 }}
              whileTap={{ scale: isConnected ? 1 : 0.95 }}
              className={`
                px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2
                ${isConnected 
                  ? 'bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-red-600/20 hover:border-red-500/30 hover:text-red-400' 
                  : isConnecting
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                  : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-orange-500/25'
                }
              `}
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300/30 border-t-gray-300 rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : isConnected ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                  <span>Connect</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 