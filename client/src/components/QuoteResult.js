import React, { useState } from 'react';
import moment from 'moment';

const QuoteResult = ({ quote, onBookingConfirm, onQuoteDecline }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleBookingConfirm = async () => {
    setIsProcessing(true);
    setMessage(null);
    
    try {
      const bookingData = {
        requestId: quote.requestId,
        bookingId: `booking_${Date.now()}`,
        customerId: 'customer-001',
        forwarderId: 'forwarder-001',
        finalPrice: quote.predictedPrice
      };
      
      await onBookingConfirm(bookingData);
      setMessage({
        type: 'success',
        text: 'Booking confirmed successfully! Data logged for model training.'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to confirm booking. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuoteDecline = async () => {
    setIsProcessing(true);
    setMessage(null);
    
    try {
      const declineData = {
        requestId: quote.requestId,
        reason: 'Price too high',
        customerId: 'customer-001',
        forwarderId: 'forwarder-001'
      };
      
      await onQuoteDecline(declineData);
      setMessage({
        type: 'success',
        text: 'Quote decline logged for model training.'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to log quote decline. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#10b981'; // green
    if (confidence >= 0.6) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="quote-result">
      <div className="result-header">
        <h3 className="result-title">FreightIQ Prediction</h3>
        <div className="result-price">
          ${quote.predictedPrice.toLocaleString()}
          <span className="result-currency">USD</span>
        </div>
        
        <div className="confidence-score">
          <span>{getConfidenceLabel(quote.confidence)}</span>
          <div className="confidence-bar">
            <div 
              className="confidence-fill"
              style={{ 
                width: `${quote.confidence * 100}%`,
                backgroundColor: getConfidenceColor(quote.confidence)
              }}
            ></div>
          </div>
          <span>{Math.round(quote.confidence * 100)}%</span>
        </div>
      </div>

      {message && (
        <div className={`${message.type === 'success' ? 'success-message' : 'error-message'}`}>
          {message.text}
        </div>
      )}

      <div className="result-breakdown">
        <h4 className="breakdown-title">Price Breakdown</h4>
        
        <div className="breakdown-item">
          <span className="breakdown-label">Base Cost</span>
          <span className="breakdown-value">${quote.breakdown.baseCost.toLocaleString()}</span>
        </div>
        
        <div className="breakdown-item">
          <span className="breakdown-label">Surcharges</span>
          <span className="breakdown-value">${quote.breakdown.surcharges.toLocaleString()}</span>
        </div>
        
        <div className="breakdown-item">
          <span className="breakdown-label">Market Adjustment</span>
          <span className="breakdown-value">
            {quote.breakdown.marketAdjustment > 0 ? '+' : ''}
            {Math.round(quote.breakdown.marketAdjustment * 100)}%
          </span>
        </div>
        
        <div className="breakdown-item">
          <span className="breakdown-label">ML Prediction Adjustment</span>
          <span className="breakdown-value">
            {quote.breakdown.mlPrediction > 0 ? '+' : ''}
            ${quote.breakdown.mlPrediction.toLocaleString()}
          </span>
        </div>
        
        <div className="breakdown-item">
          <span className="breakdown-label">Total Predicted Price</span>
          <span className="breakdown-value">${quote.predictedPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="confidence-band">
        <h4 className="breakdown-title">Confidence Band</h4>
        <div className="breakdown-item">
          <span className="breakdown-label">Lower Bound</span>
          <span className="breakdown-value">${quote.confidenceBand.lower.toLocaleString()}</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">Upper Bound</span>
          <span className="breakdown-value">${quote.confidenceBand.upper.toLocaleString()}</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">Range</span>
          <span className="breakdown-value">±{quote.confidenceBand.percentage}%</span>
        </div>
      </div>

      <div className="margin-info">
        <h4 className="breakdown-title">Margin Information</h4>
        <div className="breakdown-item">
          <span className="breakdown-label">Margin Range</span>
          <span className="breakdown-value">
            ${quote.marginRange.minMargin.toLocaleString()} - ${quote.marginRange.maxMargin.toLocaleString()}
          </span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">Margin Percentage</span>
          <span className="breakdown-value">{quote.marginRange.percentage}%</span>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="action-button confirm-button"
          onClick={handleBookingConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="loading"></div>
              Processing...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
        
        <button
          className="action-button decline-button"
          onClick={handleQuoteDecline}
          disabled={isProcessing}
        >
          Decline Quote
        </button>
      </div>

      <div className="quote-metadata">
        <p className="text-sm text-gray-500 text-center mt-4">
          Request ID: {quote.requestId} | 
          Generated: {moment(quote.timestamp).format('MMM DD, YYYY HH:mm')}
        </p>
      </div>
    </div>
  );
};

export default QuoteResult;
