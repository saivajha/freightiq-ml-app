import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import QuoteForm from './components/QuoteForm';
import QuoteResult from './components/QuoteResult';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import FreightIQLogo from './components/FreightIQLogo';
import './App.css';

function App() {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuoteSubmit = async (quoteData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/predict-rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      if (!response.ok) {
        throw new Error('Failed to get rate prediction');
      }

      const result = await response.json();
      setCurrentQuote(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingConfirm = async (bookingData) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/confirm-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm booking');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleQuoteDecline = async (declineData) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/decline-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(declineData),
      });

      if (!response.ok) {
        throw new Error('Failed to decline quote');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route 
                path="/" 
                element={
                  <div>
                    <div className="hero-section">
                      <div className="hero-content">
                        <FreightIQLogo size={200} showText={true} className="hero-logo" />
                        <p className="hero-description">
                          AI-powered freight pricing that combines real-time market data, 
                          cost analysis, and machine learning to deliver optimal pricing 
                          with confidence scores.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-2 gap-6">
                      <div>
                        <QuoteForm 
                          onSubmit={handleQuoteSubmit}
                          isLoading={isLoading}
                          error={error}
                        />
                      </div>
                      <div>
                        {currentQuote && (
                          <QuoteResult 
                            quote={currentQuote}
                            onBookingConfirm={handleBookingConfirm}
                            onQuoteDecline={handleQuoteDecline}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                } 
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
