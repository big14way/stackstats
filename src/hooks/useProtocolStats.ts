import { useState, useEffect, useCallback } from 'react';
import EkuboApiService from '../lib/ekuboApi';

interface ProtocolStats {
  apy: number;
  tvl: number;
  cdr: number;
  isLoading: boolean;
  error: string | null;
}

interface UseProtocolStatsOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

export function useProtocolStats(options: UseProtocolStatsOptions = {}) {
  const { refreshInterval = 30000, enabled = true } = options; // Default 30 seconds
  
  const [stats, setStats] = useState<ProtocolStats>({
    apy: 4.2,
    tvl: 2100000,
    cdr: 185,
    isLoading: true,
    error: null
  });

  const fetchStats = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setStats(prev => ({ ...prev, isLoading: true, error: null }));
      const newStats = await EkuboApiService.getProtocolStats();
      setStats(newStats);
    } catch (error) {
      setStats(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  }, [enabled]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchStats();
    }
  }, [fetchStats, enabled]);

  // Set up refresh interval
  useEffect(() => {
    if (!enabled || !refreshInterval) return;

    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchStats, refreshInterval, enabled]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    ...stats,
    refresh
  };
}

export default useProtocolStats; 