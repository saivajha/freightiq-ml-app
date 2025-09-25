# FreightIQ - Rapid Best Freight Cost Predictor

FreightIQ is an AI-powered freight pricing application that helps freight forwarders predict optimal pricing for their customer quotes. The system combines real-time market data, cost analysis, and machine learning to provide accurate freight rate predictions with confidence scores.

## 🚀 Features

### Core Functionality
- **AI-Powered Rate Prediction**: Machine learning engine that predicts optimal freight pricing
- **Real-time Market Data Integration**: Lane Competitiveness Index (LCI) with congestion, fuel prices, and market trends
- **Cost Data Integration**: Rate Management System (RMS) integration for base costs and surcharges
- **Confidence Scoring**: Provides confidence bands and accuracy metrics for each prediction
- **Booking Tracking**: Captures booking confirmations and declines for continuous model improvement

### User Interface
- **Quote Request Form**: Intuitive form for entering freight details
- **Real-time Results**: Instant pricing with detailed breakdowns
- **Dashboard**: Performance metrics and system health monitoring
- **Advanced Analytics**: Deep insights into model performance and market trends

### Technical Features
- **RESTful API**: Clean API endpoints for rate prediction and booking management
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Real-time Updates**: Live data integration and processing
- **Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Architecture

The application follows the architecture outlined in the FreightIQ solution diagram:

### Backend Services
- **FreightIQ Engine**: Core ML prediction engine with ensemble regression and Bayesian optimization
- **RMS Connector**: Simulates integration with Rate Management Systems
- **LCI Connector**: Lane Competitiveness Index microservice for market data
- **Training Store**: Captures booking data for continuous model improvement

### Frontend Components
- **Quote Form**: Customer-facing interface for rate requests
- **Result Display**: Shows predictions with confidence scores and breakdowns
- **Dashboard**: Analytics and performance monitoring
- **Navigation**: Seamless routing between different sections

## 🛠️ Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Moment.js**: Date/time handling
- **UUID**: Unique identifier generation

### Frontend
- **React**: User interface library
- **React Router**: Client-side routing
- **Recharts**: Data visualization
- **Axios**: HTTP client
- **CSS3**: Styling with custom design system

### Development Tools
- **Concurrently**: Run multiple npm scripts simultaneously
- **Nodemon**: Development server with auto-restart

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freightiq-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## 🚀 Usage

### Getting a Freight Quote

1. **Navigate to the Quote Request page**
2. **Fill in the required information**:
   - Origin and destination ports
   - Cargo type and service level
   - Weight and volume
   - Customer information

3. **Submit the request** to get an AI-powered price prediction

4. **Review the results**:
   - Predicted price with confidence score
   - Detailed cost breakdown
   - Confidence band (upper/lower bounds)
   - Margin information

5. **Take action**:
   - Confirm booking to log successful transaction
   - Decline quote to provide feedback for model improvement

### Dashboard & Analytics

- **Dashboard**: View key performance metrics and system status
- **Analytics**: Deep dive into model performance, market trends, and competitive analysis

## 🔧 API Endpoints

### Rate Prediction
```http
POST /api/predict-rate
Content-Type: application/json

{
  "origin": "Shanghai",
  "destination": "Los Angeles",
  "cargoType": "general",
  "weight": 1000,
  "volume": 5.5,
  "serviceType": "standard",
  "customerId": "customer-001",
  "forwarderId": "forwarder-001"
}
```

### Booking Confirmation
```http
POST /api/confirm-booking
Content-Type: application/json

{
  "requestId": "req_123456789",
  "bookingId": "booking_123456789",
  "customerId": "customer-001",
  "forwarderId": "forwarder-001",
  "finalPrice": 2850.00
}
```

### Quote Decline
```http
POST /api/decline-quote
Content-Type: application/json

{
  "requestId": "req_123456789",
  "reason": "Price too high",
  "customerId": "customer-001",
  "forwarderId": "forwarder-001"
}
```

### Analytics
```http
GET /api/analytics
```

## 📊 Key Metrics

The application tracks several important metrics:

- **Win Rate**: Percentage of quotes that result in bookings
- **Prediction Accuracy**: How close predictions are to actual market rates
- **Confidence Score**: Model's confidence in each prediction
- **Response Time**: Speed of rate prediction generation
- **Margin Performance**: Average margin achieved vs. industry benchmarks

## 🎯 Business Outcomes

Based on the FreightIQ solution architecture, the application delivers:

- **↑20-30% quoting speed**: Instant rate predictions vs. manual calculations
- **↑15% win rate**: AI-optimized pricing improves conversion
- **↑10-12% margins**: Better pricing strategies maximize profitability

## 🔮 Future Enhancements

### Planned Features
- **Real-time Market Data**: Integration with live market data feeds
- **Advanced ML Models**: Deep learning models for better predictions
- **Multi-currency Support**: Support for different currencies and regions
- **API Rate Limiting**: Production-ready rate limiting and authentication
- **Database Integration**: Persistent storage for training data and analytics
- **Notification System**: Real-time alerts for market changes
- **Mobile App**: Native mobile application for on-the-go access

### Technical Improvements
- **Microservices Architecture**: Break down into smaller, scalable services
- **Container Deployment**: Docker containers for easy deployment
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring & Logging**: Comprehensive observability
- **Security Enhancements**: OAuth2, API keys, and data encryption

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About FreightIQ

FreightIQ is a cutting-edge freight pricing solution that combines artificial intelligence with real-time market data to help freight forwarders make smarter pricing decisions. Our mission is to revolutionize freight pricing through technology and data-driven insights.

**Tagline**: "Brains behind the quote!"

---

For more information, visit [FreightIQ Inc.](https://freightiq.com) or contact our team.
