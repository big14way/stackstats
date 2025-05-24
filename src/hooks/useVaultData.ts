import { useState, useEffect, useCallback } from 'react';
import EkuboApiService, { PoolPairData } from '../lib/ekuboApi';

interface VaultData {
  totalAssets: number;
  totalShares: number;
  sharePrice: number;
  apy: number;
  btcPrice: number;
  btcPairs: PoolPairData[];
  isLoading: boolean;
  error: string | null;
}

interface UseVaultDataOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

export function useVaultData(options: UseVaultDataOptions = {}) {
  const { refreshInterval = 60000, enabled = true } = options; // Default 1 minute

  const [vaultData, setVaultData] = useState<VaultData>({
    totalAssets: 45.67,
    totalShares: 42.15,
    sharePrice: 1.0834,
    apy: 4.2,
    btcPrice: 94250,
    btcPairs: [],
    isLoading: true,
    error: null
  });

  const fetchVaultData = useCallback(async () => {
    if (!enabled) return;

    try {
      setVaultData(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Fetch live data from Ekubo
      const incentivesData = await EkuboApiService.getDefiSpringIncentives();
      const btcPairs = EkuboApiService.findBtcPairs(incentivesData);
      
      // Calculate average APY for BTC pairs
      const averageApy = btcPairs.length > 0 
        ? btcPairs.reduce((sum, pair) => sum + (pair.currentApr * 100), 0) / btcPairs.length 
        : 4.2;

      // In a real implementation, these would come from:
      // 1. Smart contract calls for vault data (totalAssets, shares, etc.)
      // 2. Price feeds for BTC price
      // 3. On-chain calculations for share price
      
      setVaultData(prev => ({
        ...prev,
        apy: Number(averageApy.toFixed(1)),
        btcPairs,
        isLoading: false,
        error: null
      }));

    } catch (error) {
      setVaultData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vault data'
      }));
    }
  }, [enabled]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchVaultData();
    }
  }, [fetchVaultData, enabled]);

  // Set up refresh interval
  useEffect(() => {
    if (!enabled || !refreshInterval) return;

    const interval = setInterval(fetchVaultData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchVaultData, refreshInterval, enabled]);

  const refresh = useCallback(() => {
    fetchVaultData();
  }, [fetchVaultData]);

  return {
    ...vaultData,
    refresh
  };
}

export default useVaultData; 