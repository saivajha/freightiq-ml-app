const moment = require('moment');

class LCIConnector {
  constructor() {
    this.marketData = {};
    this.lastUpdate = moment().subtract(1, 'hour').toISOString();
  }

  /**
   * Simulates pulling market data from Lane Competitiveness Index (LCI) microservice
   * In production, this would connect to various market data providers
   */
  async getMarketData(params) {
    const { origin, destination, cargoType } = params;
    
    console.log(`LCI Connector: Fetching market data for ${origin} to ${destination}`);
    
    // Simulate API call delay
    await this.simulateAPIDelay();
    
    // Get route-specific market data
    const routeData = this.getRouteData(origin, destination);
    
    // Get current market conditions
    const marketConditions = this.getCurrentMarketConditions();
    
    // Calculate lane competitiveness index
    const competitivenessIndex = this.calculateCompetitivenessIndex(routeData, marketConditions);
    
    // Calculate market adjustment factor
    const adjustment = this.calculateMarketAdjustment(competitivenessIndex, marketConditions);
    
    // Get volatility metrics
    const volatility = this.calculateVolatility(routeData, marketConditions);
    
    return {
      competitivenessIndex,
      adjustment,
      volatility,
      routePopularity: routeData.popularity,
      congestionLevel: marketConditions.congestion,
      bunkerFuelPrice: marketConditions.bunkerFuel,
      shanghaiIndex: marketConditions.shanghaiIndex,
      historicalVolatility: routeData.historicalVolatility,
      timestamp: moment().toISOString(),
      dataQuality: this.assessDataQuality(routeData, marketConditions)
    };
  }

  getRouteData(origin, destination) {
    const routeKey = `${origin}-${destination}`;
    const routes = {
      'Shanghai-Los Angeles': {
        popularity: 0.9,
        historicalVolatility: 0.15,
        seasonalPattern: 'high',
        competitionLevel: 'high'
      },
      'Los Angeles-Shanghai': {
        popularity: 0.85,
        historicalVolatility: 0.12,
        seasonalPattern: 'medium',
        competitionLevel: 'high'
      },
      'Hamburg-New York': {
        popularity: 0.8,
        historicalVolatility: 0.18,
        seasonalPattern: 'medium',
        competitionLevel: 'medium'
      },
      'New York-Hamburg': {
        popularity: 0.75,
        historicalVolatility: 0.16,
        seasonalPattern: 'medium',
        competitionLevel: 'medium'
      },
      'Singapore-Rotterdam': {
        popularity: 0.7,
        historicalVolatility: 0.20,
        seasonalPattern: 'low',
        competitionLevel: 'low'
      },
      'default': {
        popularity: 0.6,
        historicalVolatility: 0.25,
        seasonalPattern: 'medium',
        competitionLevel: 'medium'
      }
    };
    
    return routes[routeKey] || routes['default'];
  }

  getCurrentMarketConditions() {
    // Simulate real-time market data
    const now = moment();
    const hour = now.hour();
    const dayOfWeek = now.day();
    
    // Simulate congestion patterns (higher during business hours)
    const congestionBase = 0.3 + (hour > 8 && hour < 18 ? 0.2 : 0);
    const congestion = Math.min(1.0, congestionBase + Math.random() * 0.3);
    
    // Simulate bunker fuel price fluctuations
    const bunkerFuelBase = 450 + Math.sin(now.dayOfYear() / 365 * 2 * Math.PI) * 50;
    const bunkerFuel = bunkerFuelBase + Math.random() * 20 - 10;
    
    // Simulate Shanghai Freight Index
    const shanghaiIndexBase = 1200 + Math.sin(now.dayOfYear() / 365 * 2 * Math.PI) * 200;
    const shanghaiIndex = shanghaiIndexBase + Math.random() * 100 - 50;
    
    return {
      congestion,
      bunkerFuel: Math.round(bunkerFuel * 100) / 100,
      shanghaiIndex: Math.round(shanghaiIndex * 100) / 100,
      portDelays: this.calculatePortDelays(congestion),
      weatherImpact: this.getWeatherImpact(),
      economicIndicators: this.getEconomicIndicators()
    };
  }

  calculateCompetitivenessIndex(routeData, marketConditions) {
    let index = 0.5; // Base competitiveness
    
    // Adjust based on route popularity
    index += routeData.popularity * 0.3;
    
    // Adjust based on congestion (higher congestion = lower competitiveness)
    index -= marketConditions.congestion * 0.2;
    
    // Adjust based on competition level
    const competitionMultipliers = {
      'high': 0.2,
      'medium': 0.1,
      'low': 0.0
    };
    index += competitionMultipliers[routeData.competitionLevel];
    
    // Add some randomness for market dynamics
    index += (Math.random() - 0.5) * 0.1;
    
    return Math.max(0.0, Math.min(1.0, index));
  }

  calculateMarketAdjustment(competitivenessIndex, marketConditions) {
    let adjustment = 0;
    
    // High competitiveness = lower prices (negative adjustment)
    adjustment -= (competitivenessIndex - 0.5) * 0.2;
    
    // High congestion = higher prices (positive adjustment)
    adjustment += marketConditions.congestion * 0.15;
    
    // High bunker fuel prices = higher prices
    const fuelAdjustment = (marketConditions.bunkerFuel - 450) / 450 * 0.1;
    adjustment += fuelAdjustment;
    
    // Shanghai Index impact
    const indexAdjustment = (marketConditions.shanghaiIndex - 1200) / 1200 * 0.05;
    adjustment += indexAdjustment;
    
    return Math.round(adjustment * 1000) / 1000; // Round to 3 decimal places
  }

  calculateVolatility(routeData, marketConditions) {
    let volatility = routeData.historicalVolatility;
    
    // Increase volatility during high congestion periods
    if (marketConditions.congestion > 0.7) {
      volatility += 0.05;
    }
    
    // Increase volatility for less popular routes
    if (routeData.popularity < 0.5) {
      volatility += 0.03;
    }
    
    // Add current market volatility
    volatility += Math.random() * 0.05;
    
    return Math.min(0.5, Math.max(0.05, volatility));
  }

  calculatePortDelays(congestion) {
    const baseDelay = 2; // hours
    const congestionDelay = congestion * 8; // up to 8 hours additional delay
    return Math.round((baseDelay + congestionDelay) * 100) / 100;
  }

  getWeatherImpact() {
    // Simulate weather impact on shipping
    const weatherEvents = ['normal', 'storm', 'fog', 'ice'];
    const event = weatherEvents[Math.floor(Math.random() * weatherEvents.length)];
    
    const impacts = {
      'normal': 0,
      'storm': 0.1,
      'fog': 0.05,
      'ice': 0.15
    };
    
    return {
      event,
      impact: impacts[event]
    };
  }

  getEconomicIndicators() {
    // Simulate economic indicators that affect freight rates
    return {
      gdpGrowth: 2.5 + Math.random() * 2 - 1,
      inflation: 2.0 + Math.random() * 1 - 0.5,
      tradeVolume: 1.0 + Math.random() * 0.3 - 0.15,
      currencyStrength: 0.5 + Math.random() * 0.4 - 0.2
    };
  }

  assessDataQuality(routeData, marketConditions) {
    let quality = 0.8; // Base quality
    
    // Higher quality for popular routes (more data)
    quality += routeData.popularity * 0.1;
    
    // Lower quality during extreme conditions
    if (marketConditions.congestion > 0.8) quality -= 0.1;
    if (marketConditions.weatherImpact.impact > 0.1) quality -= 0.05;
    
    return Math.max(0.5, Math.min(1.0, quality));
  }

  async simulateAPIDelay() {
    // Simulate LCI API response time (30-150ms)
    const delay = Math.random() * 120 + 30;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Method to refresh market data (would be called periodically in production)
  async refreshMarketData() {
    console.log('LCI Connector: Refreshing market data from external sources');
    this.lastUpdate = moment().toISOString();
    // In production, this would fetch latest data from various market data providers
    return { success: true, timestamp: this.lastUpdate };
  }
}

module.exports = LCIConnector;
