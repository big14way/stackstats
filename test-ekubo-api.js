// Simple test script to verify Ekubo API integration
const EKUBO_API_BASE = 'https://starknet-mainnet-api.ekubo.org';

async function testEkuboApi() {
  console.log('🧪 Testing Ekubo API Integration...\n');

  try {
    // Test overview endpoint
    console.log('📊 Fetching protocol overview...');
    const overviewResponse = await fetch(`${EKUBO_API_BASE}/overview`);
    const overview = await overviewResponse.json();
    console.log(`✅ Overview data received. Timestamp: ${overview.timestamp}`);
    console.log(`📈 Number of tokens with TVL: ${overview.tvlByToken.length}\n`);

    // Test defi spring incentives
    console.log('🌱 Fetching DeFi Spring incentives...');
    const incentivesResponse = await fetch(`${EKUBO_API_BASE}/defi-spring-incentives`);
    const incentives = await incentivesResponse.json();
    console.log(`✅ Incentives data received`);
    console.log(`💰 STRK Price: $${incentives.strkPrice}`);
    console.log(`🏊 Total pairs: ${incentives.pairs.length}`);

    // Find BTC pairs
    const btcPairs = incentives.pairs.filter(pair => 
      pair.token0.symbol === 'WBTC' || 
      pair.token1.symbol === 'WBTC' ||
      pair.token0.name.toLowerCase().includes('btc') ||
      pair.token1.name.toLowerCase().includes('btc')
    );

    console.log(`₿ BTC-related pairs found: ${btcPairs.length}`);
    
    if (btcPairs.length > 0) {
      console.log('\n🔍 BTC Pairs Details:');
      btcPairs.forEach((pair, index) => {
        console.log(`  ${index + 1}. ${pair.token0.symbol}/${pair.token1.symbol}`);
        console.log(`     APR: ${(pair.currentApr * 100).toFixed(3)}%`);
        console.log(`     TVL: $${pair.consideredTvl.toLocaleString()}`);
      });

      // Calculate weighted average APY
      const totalTvl = btcPairs.reduce((sum, pair) => sum + pair.consideredTvl, 0);
      const weightedApy = btcPairs.reduce((sum, pair) => 
        sum + (pair.currentApr * 100 * pair.consideredTvl), 0) / totalTvl;
      
      console.log(`\n📊 Weighted Average BTC APY: ${weightedApy.toFixed(2)}%`);
    }

    // Test TVL endpoint
    console.log('\n💎 Testing TVL endpoint...');
    const tvlResponse = await fetch(`${EKUBO_API_BASE}/overview/tvl`);
    const tvlData = await tvlResponse.json();
    console.log(`✅ TVL data received with ${tvlData.length} entries`);

    console.log('\n🎉 All API tests passed! Integration is working correctly.');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run the test
testEkuboApi(); 