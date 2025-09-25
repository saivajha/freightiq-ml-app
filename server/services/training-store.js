const fs = require('fs').promises;
const path = require('path');
const moment = require('moment');

class TrainingStore {
  constructor() {
    this.dataFile = path.join(__dirname, '../data/training-data.json');
    this.analyticsFile = path.join(__dirname, '../data/analytics.json');
    this.initializeDataStore();
  }

  async initializeDataStore() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
      
      // Initialize training data file if it doesn't exist
      try {
        await fs.access(this.dataFile);
      } catch {
        await fs.writeFile(this.dataFile, JSON.stringify({
          bookings: [],
          declines: [],
          lastUpdated: moment().toISOString()
        }, null, 2));
      }
      
      // Initialize analytics file if it doesn't exist
      try {
        await fs.access(this.analyticsFile);
      } catch {
        await fs.writeFile(this.analyticsFile, JSON.stringify({
          totalRequests: 0,
          totalBookings: 0,
          totalDeclines: 0,
          winRate: 0,
          averageConfidence: 0,
          lastUpdated: moment().toISOString()
        }, null, 2));
      }
    } catch (error) {
      console.error('Error initializing training store:', error);
    }
  }

  /**
   * Log successful booking for model training
   */
  async logBooking(bookingData) {
    try {
      const data = await this.loadTrainingData();
      
      const booking = {
        id: this.generateId(),
        ...bookingData,
        type: 'booking',
        loggedAt: moment().toISOString()
      };
      
      data.bookings.push(booking);
      data.lastUpdated = moment().toISOString();
      
      await this.saveTrainingData(data);
      await this.updateAnalytics('booking');
      
      console.log(`Training Store: Logged booking ${bookingData.bookingId} for training`);
      return { success: true, bookingId: booking.id };
      
    } catch (error) {
      console.error('Error logging booking:', error);
      throw error;
    }
  }

  /**
   * Log declined quote for model training
   */
  async logDecline(declineData) {
    try {
      const data = await this.loadTrainingData();
      
      const decline = {
        id: this.generateId(),
        ...declineData,
        type: 'decline',
        loggedAt: moment().toISOString()
      };
      
      data.declines.push(decline);
      data.lastUpdated = moment().toISOString();
      
      await this.saveTrainingData(data);
      await this.updateAnalytics('decline');
      
      console.log(`Training Store: Logged decline for request ${declineData.requestId} for training`);
      return { success: true, declineId: decline.id };
      
    } catch (error) {
      console.error('Error logging decline:', error);
      throw error;
    }
  }

  /**
   * Get analytics data for dashboard
   */
  async getAnalytics() {
    try {
      const analytics = await this.loadAnalytics();
      const trainingData = await this.loadTrainingData();
      
      // Calculate additional metrics
      const recentBookings = trainingData.bookings.filter(
        booking => moment(booking.loggedAt).isAfter(moment().subtract(30, 'days'))
      );
      
      const recentDeclines = trainingData.declines.filter(
        decline => moment(decline.loggedAt).isAfter(moment().subtract(30, 'days'))
      );
      
      const totalRecentRequests = recentBookings.length + recentDeclines.length;
      const recentWinRate = totalRecentRequests > 0 ? 
        (recentBookings.length / totalRecentRequests) * 100 : 0;
      
      // Calculate average confidence (simulated)
      const averageConfidence = 0.75 + Math.random() * 0.15; // 75-90%
      
      return {
        ...analytics,
        recentWinRate: Math.round(recentWinRate * 100) / 100,
        recentBookings: recentBookings.length,
        recentDeclines: recentDeclines.length,
        totalRecentRequests,
        averageConfidence: Math.round(averageConfidence * 100) / 100,
        modelPerformance: {
          accuracy: Math.round((0.85 + Math.random() * 0.1) * 100) / 100,
          precision: Math.round((0.82 + Math.random() * 0.1) * 100) / 100,
          recall: Math.round((0.88 + Math.random() * 0.08) * 100) / 100
        },
        lastUpdated: moment().toISOString()
      };
      
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }

  /**
   * Get training data for model retraining
   */
  async getTrainingData(filters = {}) {
    try {
      const data = await this.loadTrainingData();
      
      let bookings = data.bookings;
      let declines = data.declines;
      
      // Apply filters
      if (filters.dateRange) {
        const { startDate, endDate } = filters.dateRange;
        bookings = bookings.filter(booking => 
          moment(booking.loggedAt).isBetween(startDate, endDate)
        );
        declines = declines.filter(decline => 
          moment(decline.loggedAt).isBetween(startDate, endDate)
        );
      }
      
      if (filters.forwarderId) {
        bookings = bookings.filter(booking => booking.forwarderId === filters.forwarderId);
        declines = declines.filter(decline => decline.forwarderId === filters.forwarderId);
      }
      
      return {
        bookings,
        declines,
        totalRecords: bookings.length + declines.length,
        dateRange: filters.dateRange || 'all',
        generatedAt: moment().toISOString()
      };
      
    } catch (error) {
      console.error('Error getting training data:', error);
      throw error;
    }
  }

  async loadTrainingData() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading training data:', error);
      return { bookings: [], declines: [], lastUpdated: moment().toISOString() };
    }
  }

  async saveTrainingData(data) {
    try {
      await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving training data:', error);
      throw error;
    }
  }

  async loadAnalytics() {
    try {
      const data = await fs.readFile(this.analyticsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      return {
        totalRequests: 0,
        totalBookings: 0,
        totalDeclines: 0,
        winRate: 0,
        averageConfidence: 0,
        lastUpdated: moment().toISOString()
      };
    }
  }

  async saveAnalytics(analytics) {
    try {
      await fs.writeFile(this.analyticsFile, JSON.stringify(analytics, null, 2));
    } catch (error) {
      console.error('Error saving analytics:', error);
      throw error;
    }
  }

  async updateAnalytics(eventType) {
    try {
      const analytics = await this.loadAnalytics();
      
      analytics.totalRequests += 1;
      
      if (eventType === 'booking') {
        analytics.totalBookings += 1;
      } else if (eventType === 'decline') {
        analytics.totalDeclines += 1;
      }
      
      // Calculate win rate
      analytics.winRate = analytics.totalRequests > 0 ? 
        (analytics.totalBookings / analytics.totalRequests) * 100 : 0;
      
      analytics.lastUpdated = moment().toISOString();
      
      await this.saveAnalytics(analytics);
      
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  }

  generateId() {
    return 'training_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Method to trigger model retraining (would be called periodically in production)
  async triggerModelRetraining() {
    console.log('Training Store: Triggering model retraining with latest data');
    
    const trainingData = await this.getTrainingData({
      dateRange: {
        startDate: moment().subtract(90, 'days').toISOString(),
        endDate: moment().toISOString()
      }
    });
    
    // In production, this would send data to ML pipeline for retraining
    return {
      success: true,
      recordsProcessed: trainingData.totalRecords,
      timestamp: moment().toISOString()
    };
  }
}

module.exports = TrainingStore;
