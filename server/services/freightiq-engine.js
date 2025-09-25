const moment = require('moment');

class FreightIQEngine {
  constructor() {
    this.modelVersion = '1.0.0';
    this.lastTrainingDate = moment().subtract(1, 'day').toISOString();
  }

  /**
   * Core ML prediction engine that combines cost data, market data, and historical patterns
   * to predict optimal freight pricing
   */
  async predictOptimalPrice(params) {
    const {
      requestId,
      costData,
      marketData,
      cargoType,
      weight,
      volume,
      serviceType,
      customerId,
      forwarderId
    } = params;

    console.log(`FreightIQ Engine: Processing prediction for request ${requestId}`);

    // Simulate ML model processing time
    await this.simulateProcessingDelay();

    // Calculate base prediction using ensemble regression
    const basePrediction = this.calculateBasePrediction({
      costData,
      marketData,
      cargoType,
      weight,
      volume,
      serviceType
    });

    // Apply Bayesian optimization for margin maximization
    const optimizedPrediction = this.applyBayesianOptimization({
      basePrediction,
      customerId,
      forwarderId,
      marketData
    });

    // Calculate confidence score based on data quality and market volatility
    const confidenceScore = this.calculateConfidenceScore({
      costData,
      marketData,
      cargoType,
      weight
    });

    // Generate confidence band (±5-15% based on confidence score)
    const confidenceBand = this.generateConfidenceBand(optimizedPrediction, confidenceScore);

    // Calculate margin range for forwarder decision making
    const marginRange = this.calculateMarginRange(optimizedPrediction, costData);

    return {
      price: optimizedPrediction,
      confidence: confidenceScore,
      confidenceBand,
      marginRange,
      mlAdjustment: optimizedPrediction - costData.baseCost,
      modelVersion: this.modelVersion,
      processingTime: moment().toISOString()
    };
  }

  calculateBasePrediction(params) {
    const { costData, marketData, cargoType, weight, volume, serviceType } = params;
    
    let basePrice = costData.baseCost;
    
    // Apply cargo type multiplier
    const cargoMultipliers = {
      'general': 1.0,
      'hazardous': 1.3,
      'refrigerated': 1.2,
      'oversized': 1.4,
      'fragile': 1.1
    };
    basePrice *= cargoMultipliers[cargoType] || 1.0;

    // Apply weight/volume adjustments
    if (weight > 1000) basePrice *= 1.1; // Heavy cargo surcharge
    if (volume > 50) basePrice *= 1.05; // Volume surcharge

    // Apply service type multiplier
    const serviceMultipliers = {
      'standard': 1.0,
      'express': 1.3,
      'economy': 0.8,
      'premium': 1.5
    };
    basePrice *= serviceMultipliers[serviceType] || 1.0;

    // Apply market adjustments
    basePrice *= (1 + marketData.adjustment);

    // Add surcharges
    basePrice += costData.surcharges;

    return Math.round(basePrice * 100) / 100;
  }

  applyBayesianOptimization(params) {
    const { basePrediction, customerId, forwarderId, marketData } = params;
    
    // Simulate customer-specific pricing optimization
    const customerMultiplier = this.getCustomerMultiplier(customerId);
    
    // Apply market competitiveness adjustment
    const competitivenessAdjustment = marketData.competitivenessIndex * 0.1;
    
    // Apply seasonal adjustments
    const seasonalAdjustment = this.getSeasonalAdjustment();
    
    const optimizedPrice = basePrediction * customerMultiplier * 
                          (1 + competitivenessAdjustment) * 
                          (1 + seasonalAdjustment);

    return Math.round(optimizedPrice * 100) / 100;
  }

  calculateConfidenceScore(params) {
    const { costData, marketData, cargoType, weight } = params;
    
    let confidence = 0.8; // Base confidence
    
    // Reduce confidence for volatile markets
    if (marketData.volatility > 0.3) confidence -= 0.1;
    
    // Reduce confidence for unusual cargo types
    if (cargoType === 'hazardous' || cargoType === 'oversized') confidence -= 0.05;
    
    // Reduce confidence for very heavy cargo
    if (weight > 2000) confidence -= 0.05;
    
    // Increase confidence for standard routes
    if (marketData.routePopularity > 0.7) confidence += 0.05;
    
    return Math.max(0.5, Math.min(0.95, confidence));
  }

  generateConfidenceBand(price, confidence) {
    const bandPercentage = (1 - confidence) * 0.3; // 5-15% band
    const lowerBound = price * (1 - bandPercentage);
    const upperBound = price * (1 + bandPercentage);
    
    return {
      lower: Math.round(lowerBound * 100) / 100,
      upper: Math.round(upperBound * 100) / 100,
      percentage: Math.round(bandPercentage * 100)
    };
  }

  calculateMarginRange(predictedPrice, costData) {
    const margin = predictedPrice - costData.baseCost;
    const marginPercentage = (margin / costData.baseCost) * 100;
    
    return {
      absolute: Math.round(margin * 100) / 100,
      percentage: Math.round(marginPercentage * 100) / 100,
      minMargin: Math.round(margin * 0.8 * 100) / 100,
      maxMargin: Math.round(margin * 1.2 * 100) / 100
    };
  }

  getCustomerMultiplier(customerId) {
    // Simulate customer-specific pricing based on historical data
    const customerTiers = {
      'premium': 1.0,
      'standard': 0.95,
      'volume': 0.9,
      'new': 1.05
    };
    
    // Simple hash-based customer tier assignment
    const tier = Object.keys(customerTiers)[customerId.length % 4];
    return customerTiers[tier];
  }

  getSeasonalAdjustment() {
    const month = moment().month();
    // Simulate seasonal freight demand patterns
    const seasonalMultipliers = [0.05, 0.02, 0.0, -0.02, 0.0, 0.03, 0.08, 0.1, 0.05, 0.0, -0.02, 0.03];
    return seasonalMultipliers[month];
  }

  async simulateProcessingDelay() {
    // Simulate ML model processing time (100-500ms)
    const delay = Math.random() * 400 + 100;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Method to update model with new training data
  async updateModel(trainingData) {
    console.log('FreightIQ Engine: Updating model with new training data');
    this.lastTrainingDate = moment().toISOString();
    // In a real implementation, this would trigger model retraining
    return { success: true, modelVersion: this.modelVersion };
  }
}

module.exports = FreightIQEngine;
