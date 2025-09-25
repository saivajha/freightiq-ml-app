const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const moment = require('moment');

// Import services
const FreightIQEngine = require('./services/freightiq-engine');
const RMSConnector = require('./services/rms-connector');
const LCIConnector = require('./services/lci-connector');
const TrainingStore = require('./services/training-store');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const freightIQEngine = new FreightIQEngine();
const rmsConnector = new RMSConnector();
const lciConnector = new LCIConnector();
const trainingStore = new TrainingStore();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'FreightIQ API',
    timestamp: moment().toISOString()
  });
});

// Rate prediction endpoint
app.post('/api/predict-rate', async (req, res) => {
  try {
    const { 
      origin, 
      destination, 
      cargoType, 
      weight, 
      volume, 
      serviceType,
      customerId,
      forwarderId 
    } = req.body;

    // Validate required fields
    if (!origin || !destination || !cargoType || !weight) {
      return res.status(400).json({
        error: 'Missing required fields: origin, destination, cargoType, weight'
      });
    }

    const requestId = uuidv4();
    console.log(`Processing rate request ${requestId} for ${origin} to ${destination}`);

    // Step 1: Pull cost data from RMS
    const costData = await rmsConnector.getCostData({
      origin,
      destination,
      cargoType,
      weight,
      volume,
      serviceType,
      forwarderId
    });

    // Step 2: Pull market data from LCI
    const marketData = await lciConnector.getMarketData({
      origin,
      destination,
      cargoType
    });

    // Step 3: Predict optimal price using ML core
    const prediction = await freightIQEngine.predictOptimalPrice({
      requestId,
      costData,
      marketData,
      cargoType,
      weight,
      volume,
      serviceType,
      customerId,
      forwarderId
    });

    // Step 4: Return price with confidence score
    res.json({
      requestId,
      predictedPrice: prediction.price,
      confidenceScore: prediction.confidence,
      confidenceBand: prediction.confidenceBand,
      marginRange: prediction.marginRange,
      breakdown: {
        baseCost: costData.baseCost,
        surcharges: costData.surcharges,
        marketAdjustment: marketData.adjustment,
        mlPrediction: prediction.mlAdjustment
      },
      timestamp: moment().toISOString()
    });

  } catch (error) {
    console.error('Error in rate prediction:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Booking confirmation endpoint
app.post('/api/confirm-booking', async (req, res) => {
  try {
    const { requestId, bookingId, customerId, forwarderId, finalPrice } = req.body;

    if (!requestId || !bookingId || !finalPrice) {
      return res.status(400).json({
        error: 'Missing required fields: requestId, bookingId, finalPrice'
      });
    }

    // Log successful booking for training
    await trainingStore.logBooking({
      requestId,
      bookingId,
      customerId,
      forwarderId,
      finalPrice,
      status: 'booked',
      timestamp: moment().toISOString()
    });

    res.json({
      success: true,
      message: 'Booking confirmed and logged for training',
      bookingId,
      timestamp: moment().toISOString()
    });

  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Quote decline endpoint
app.post('/api/decline-quote', async (req, res) => {
  try {
    const { requestId, reason, customerId, forwarderId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        error: 'Missing required field: requestId'
      });
    }

    // Log declined quote for training
    await trainingStore.logDecline({
      requestId,
      reason,
      customerId,
      forwarderId,
      status: 'declined',
      timestamp: moment().toISOString()
    });

    res.json({
      success: true,
      message: 'Quote decline logged for training',
      timestamp: moment().toISOString()
    });

  } catch (error) {
    console.error('Error logging quote decline:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await trainingStore.getAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve the React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`FreightIQ API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
