const moment = require('moment');

class RMSConnector {
  constructor() {
    this.baseCosts = this.initializeBaseCosts();
    this.surcharges = this.initializeSurcharges();
  }

  /**
   * Simulates pulling cost data from Rate Management System (RMS)
   * In production, this would connect to various RMS APIs/ETL systems
   */
  async getCostData(params) {
    const { origin, destination, cargoType, weight, volume, serviceType, forwarderId } = params;
    
    console.log(`RMS Connector: Fetching cost data for ${origin} to ${destination}`);
    
    // Simulate API call delay
    await this.simulateAPIDelay();
    
    // Get base cost for the route
    const baseCost = this.calculateBaseCost(origin, destination, weight, volume);
    
    // Calculate applicable surcharges
    const applicableSurcharges = this.calculateSurcharges({
      cargoType,
      weight,
      volume,
      serviceType,
      baseCost
    });
    
    // Get forwarder-specific adjustments
    const forwarderAdjustment = this.getForwarderAdjustment(forwarderId);
    
    const adjustedBaseCost = baseCost * forwarderAdjustment;
    
    return {
      baseCost: adjustedBaseCost,
      surcharges: applicableSurcharges,
      totalCost: adjustedBaseCost + applicableSurcharges,
      currency: 'USD',
      validUntil: moment().add(24, 'hours').toISOString(),
      forwarderId,
      route: `${origin}-${destination}`,
      timestamp: moment().toISOString()
    };
  }

  calculateBaseCost(origin, destination, weight, volume) {
    // Simulate route-based pricing
    const routeKey = `${origin}-${destination}`;
    const routeCosts = this.baseCosts[routeKey] || this.baseCosts['default'];
    
    // Base cost calculation: distance factor + weight factor + volume factor
    const distanceCost = routeCosts.perKm * routeCosts.distance;
    const weightCost = (weight / 1000) * routeCosts.perTon;
    const volumeCost = volume * routeCosts.perCubicMeter;
    
    const baseCost = distanceCost + weightCost + volumeCost;
    
    // Add some randomness to simulate market variations
    const variation = 0.9 + Math.random() * 0.2; // ±10% variation
    
    return Math.round(baseCost * variation * 100) / 100;
  }

  calculateSurcharges(params) {
    const { cargoType, weight, volume, serviceType, baseCost } = params;
    let totalSurcharges = 0;
    
    // Fuel surcharge (typically 5-15% of base cost)
    const fuelSurcharge = baseCost * this.surcharges.fuel;
    totalSurcharges += fuelSurcharge;
    
    // Security surcharge
    const securitySurcharge = baseCost * this.surcharges.security;
    totalSurcharges += securitySurcharge;
    
    // Cargo-specific surcharges
    if (cargoType === 'hazardous') {
      totalSurcharges += baseCost * this.surcharges.hazardous;
    }
    
    if (cargoType === 'refrigerated') {
      totalSurcharges += baseCost * this.surcharges.refrigerated;
    }
    
    // Weight-based surcharges
    if (weight > 1000) {
      totalSurcharges += baseCost * this.surcharges.heavyCargo;
    }
    
    // Service type surcharges
    if (serviceType === 'express') {
      totalSurcharges += baseCost * this.surcharges.express;
    }
    
    return Math.round(totalSurcharges * 100) / 100;
  }

  getForwarderAdjustment(forwarderId) {
    // Simulate forwarder-specific cost adjustments
    const adjustments = {
      'forwarder-001': 0.95, // Volume discount
      'forwarder-002': 1.0,  // Standard rates
      'forwarder-003': 1.05, // Premium service
      'default': 1.0
    };
    
    return adjustments[forwarderId] || adjustments['default'];
  }

  initializeBaseCosts() {
    return {
      'Shanghai-Los Angeles': {
        distance: 10000,
        perKm: 0.15,
        perTon: 1200,
        perCubicMeter: 80
      },
      'Los Angeles-Shanghai': {
        distance: 10000,
        perKm: 0.12,
        perTon: 1000,
        perCubicMeter: 70
      },
      'Hamburg-New York': {
        distance: 6000,
        perKm: 0.18,
        perTon: 1400,
        perCubicMeter: 90
      },
      'New York-Hamburg': {
        distance: 6000,
        perKm: 0.16,
        perTon: 1300,
        perCubicMeter: 85
      },
      'Singapore-Rotterdam': {
        distance: 12000,
        perKm: 0.14,
        perTon: 1100,
        perCubicMeter: 75
      },
      'default': {
        distance: 8000,
        perKm: 0.16,
        perTon: 1200,
        perCubicMeter: 80
      }
    };
  }

  initializeSurcharges() {
    return {
      fuel: 0.08,        // 8% fuel surcharge
      security: 0.02,    // 2% security surcharge
      hazardous: 0.15,   // 15% hazardous cargo surcharge
      refrigerated: 0.12, // 12% refrigerated cargo surcharge
      heavyCargo: 0.05,  // 5% heavy cargo surcharge
      express: 0.20      // 20% express service surcharge
    };
  }

  async simulateAPIDelay() {
    // Simulate RMS API response time (50-200ms)
    const delay = Math.random() * 150 + 50;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Method to refresh cost data (would be called periodically in production)
  async refreshCostData() {
    console.log('RMS Connector: Refreshing cost data from external systems');
    // In production, this would fetch latest rates from various RMS providers
    return { success: true, timestamp: moment().toISOString() };
  }
}

module.exports = RMSConnector;
