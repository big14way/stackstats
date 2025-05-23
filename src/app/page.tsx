'use client';

import { useState } from 'react';
import Navbar from './components/ui/Navbar';
import HeroSection from './components/ui/HeroSection';
import VaultOverview from './components/vault/VaultOverview';
import ActionModal from './components/modals/ActionModal';
// import AnimatedGuide from './components/ui/AnimatedGuide';
// import TransactionPanel from './components/ui/TransactionPanel';
// import ChartPanel from './components/ui/ChartPanel';
// import AboutSection from './components/ui/AboutSection';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<'deposit' | 'withdraw' | 'borrow' | 'repay'>('deposit');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const openModal = (action: 'deposit' | 'withdraw' | 'borrow' | 'repay') => {
    setCurrentAction(action);
    setIsModalOpen(true);
  };

  const openGuideModal = (action: 'deposit' | 'withdraw' | 'borrow' | 'repay') => {
    setCurrentAction(action);
    setShowGuideModal(true);
  };

  const handleWalletConnect = () => {
    setIsWalletConnected(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white overflow-hidden">
      {/* Navigation */}
      <Navbar 
        isWalletConnected={isWalletConnected} 
        onWalletConnect={handleWalletConnect}
      />
      
      <main className="h-screen flex flex-col">
        {/* Hero Section - Compact */}
        <div className="flex-1 flex items-center justify-center pt-16">
          <HeroSection 
            isWalletConnected={isWalletConnected} 
            onWalletConnect={handleWalletConnect}
            compact={true}
          />
        </div>
        
        {/* Vault Cards - Only show when wallet connected */}
        {isWalletConnected && (
          <div className="px-4 pb-8">
            <VaultOverview openModal={openModal} />
          </div>
        )}
      </main>

      {/* Action Modal */}
      <ActionModal 
        isOpen={isModalOpen || showGuideModal}
        onClose={() => {
          setIsModalOpen(false);
          setShowGuideModal(false);
        }}
        action={currentAction}
        isGuideMode={showGuideModal}
      />
    </div>
  );
}
