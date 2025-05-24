'use client';

import { useState } from 'react';
import Navbar from './components/ui/Navbar';
import TopStats from './components/ui/TopStats';
import HeroSection from './components/ui/HeroSection';
import VaultOverview from './components/vault/VaultOverview';
import ActionModal from './components/modals/ActionModal';

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'deposit' | 'withdraw' | 'borrow' | 'repay' | null>(null);

  const handleWalletConnect = () => {
    setIsWalletConnected(true);
  };

  const handleActionClick = (action: 'deposit' | 'withdraw' | 'borrow' | 'repay') => {
    setSelectedAction(action);
  };

  const closeModal = () => {
    setSelectedAction(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white">
      <Navbar 
        isWalletConnected={isWalletConnected} 
        onWalletConnect={handleWalletConnect} 
      />
      
      <div className="pt-16">
        {/* Top Stats Section */}
        <TopStats />
        
        {/* Hero Section with Actions Dropdown */}
        <div className="min-h-[60vh] flex items-center">
          <div className="w-full px-6">
            <HeroSection 
              isWalletConnected={isWalletConnected} 
              onWalletConnect={handleWalletConnect}
              onActionClick={handleActionClick}
            />
          </div>
        </div>

        {/* Wallet-gated content - Only the three main cards */}
        {isWalletConnected && (
          <div className="px-6 pb-16">
            <section className="py-8">
              <VaultOverview />
            </section>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedAction && (
        <ActionModal 
          action={selectedAction} 
          isOpen={true} 
          onClose={closeModal} 
        />
      )}
    </main>
  );
}
