// Ekubo API service for fetching live protocol data
const EKUBO_API_BASE = 'https://starknet-mainnet-api.ekubo.org';

// Types for API responses
export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  l2_token_address: string;
  sort_order: number;
  total_supply: number | null;
  logo_url: string;
}

export interface PoolPairData {
  token0: TokenInfo;
  token1: TokenInfo;
  currentApr: number;
  volatilityInTicks: number;
  lastAllocation: {
    token0Amount: number;
    token1Amount: number;
  };
  consideredTvl: number;
}

export interface ProtocolOverview {
  timestamp: number;
  tvlByToken: Array<{
    token: string;
    balance: string;
  }>;
}

export interface DefiSpringIncentives {
  strkPrice: number;
  totalStrk: number;
  pairs: PoolPairData[];
}

// API service functions
export class EkuboApiService {
  private static async fetchFromApi<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${EKUBO_API_BASE}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from Ekubo API endpoint ${endpoint}:`, error);
      throw error;
    }
  }

  // Get protocol overview including TVL data
  static async getProtocolOverview(): Promise<ProtocolOverview> {
    return this.fetchFromApi<ProtocolOverview>('/overview');
  }

  // Get DeFi Spring incentives data (includes APY information)
  static async getDefiSpringIncentives(): Promise<DefiSpringIncentives> {
    return this.fetchFromApi<DefiSpringIncentives>('/defi-spring-incentives');
  }

  // Get TVL data specifically
  static async getTvlData(): Promise<any> {
    return this.fetchFromApi('/overview/tvl');
  }

  // Get volume data
  static async getVolumeData(): Promise<any> {
    return this.fetchFromApi('/overview/volume');
  }

  // Get specific pair data (e.g., WBTC/USDC)
  static async getPairData(tokenA: string, tokenB: string): Promise<any> {
    return this.fetchFromApi(`/pair/${tokenA}/${tokenB}`);
  }

  // Get all supported tokens
  static async getTokens(): Promise<TokenInfo[]> {
    return this.fetchFromApi<TokenInfo[]>('/tokens');
  }

  // Helper function to calculate total TVL in USD
  static calculateTotalTvl(overview: ProtocolOverview, tokens: TokenInfo[]): number {
    let totalTvl = 0;
    
    // This is a simplified calculation - in practice you'd need:
    // 1. Token price data (from oracles or price feeds)
    // 2. Proper decimal handling for each token
    // 3. Conversion to USD values
    
    // For now, return a mock calculation
    // In a real implementation, you'd integrate with price feeds
    return 2100000; // $2.1M as placeholder
  }

  // Helper function to get weighted average APY
  static calculateWeightedApy(incentivesData: DefiSpringIncentives): number {
    if (!incentivesData.pairs.length) return 0;
    
    let totalTvl = 0;
    let weightedApy = 0;
    
    incentivesData.pairs.forEach(pair => {
      const pairTvl = pair.consideredTvl;
      const pairApr = pair.currentApr * 100; // Convert to percentage
      
      totalTvl += pairTvl;
      weightedApy += pairApr * pairTvl;
    });
    
    return totalTvl > 0 ? weightedApy / totalTvl : 0;
  }

  // Helper function to find specific token pairs (e.g., WBTC pairs)
  static findBtcPairs(incentivesData: DefiSpringIncentives): PoolPairData[] {
    return incentivesData.pairs.filter(pair => 
      pair.token0.symbol === 'WBTC' || 
      pair.token1.symbol === 'WBTC' ||
      pair.token0.name.toLowerCase().includes('btc') ||
      pair.token1.name.toLowerCase().includes('btc')
    );
  }

  // Get summarized protocol stats for dashboard
  static async getProtocolStats(): Promise<{
    apy: number;
    tvl: number;
    cdr: number;
    isLoading: boolean;
    error: string | null;
  }> {
    try {
      const [incentivesData, overviewData] = await Promise.all([
        this.getDefiSpringIncentives(),
        this.getProtocolOverview()
      ]);

      // Calculate metrics
      const btcPairs = this.findBtcPairs(incentivesData);
      const averageApy = btcPairs.length > 0 
        ? btcPairs.reduce((sum, pair) => sum + (pair.currentApr * 100), 0) / btcPairs.length 
        : 4.2; // Fallback

      // Calculate total TVL (simplified)
      const totalTvl = this.calculateTotalTvl(overviewData, []);

      return {
        apy: Number(averageApy.toFixed(1)),
        tvl: totalTvl,
        cdr: 185, // This would come from your vault contract or be calculated
        isLoading: false,
        error: null
      };
    } catch (error) {
      console.error('Error fetching protocol stats:', error);
      return {
        apy: 4.2,
        tvl: 2100000,
        cdr: 185,
        isLoading: false,
        error: 'Failed to fetch live data'
      };
    }
  }
}

// Export default instance
export default EkuboApiService; 