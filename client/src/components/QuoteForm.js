import React, { useState } from 'react';

const QuoteForm = ({ onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargoType: 'general',
    weight: '',
    volume: '',
    serviceType: 'standard',
    customerId: 'customer-001',
    forwarderId: 'forwarder-001'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const ports = [
    'Shanghai', 'Los Angeles', 'Hamburg', 'New York', 'Singapore', 'Rotterdam',
    'Tokyo', 'Hong Kong', 'Dubai', 'Mumbai', 'Barcelona', 'Antwerp'
  ];

  return (
    <div className="quote-form">
      <h2 className="form-title">Freight Rate Request</h2>
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="origin">Origin Port</label>
            <select
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Select origin port</option>
              {ports.map(port => (
                <option key={port} value={port}>{port}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="destination">Destination Port</label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Select destination port</option>
              {ports.map(port => (
                <option key={port} value={port}>{port}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="cargoType">Cargo Type</label>
            <select
              id="cargoType"
              name="cargoType"
              value={formData.cargoType}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="general">General Cargo</option>
              <option value="hazardous">Hazardous</option>
              <option value="refrigerated">Refrigerated</option>
              <option value="oversized">Oversized</option>
              <option value="fragile">Fragile</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="serviceType">Service Type</label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="economy">Economy</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="weight">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter weight in kilograms"
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="volume">Volume (m³)</label>
            <input
              type="number"
              id="volume"
              name="volume"
              value={formData.volume}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter volume in cubic meters"
              min="0.1"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-row full">
          <div className="form-group">
            <label className="form-label" htmlFor="customerId">Customer ID</label>
            <input
              type="text"
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter customer ID"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="loading"></div>
              Getting Rate Prediction...
            </>
          ) : (
            'Get Freight Rate'
          )}
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;
