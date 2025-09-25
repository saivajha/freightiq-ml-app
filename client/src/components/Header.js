import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import FreightIQLogo from './FreightIQLogo';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <FreightIQLogo size={60} showText={true} />
          </Link>
          
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Quote Request
            </Link>
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/analytics" 
              className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}
            >
              Analytics
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
