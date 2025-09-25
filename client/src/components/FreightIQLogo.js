import React from 'react';
import logoImage from '../assets/FreightIQ1.png';

const FreightIQLogo = ({ size = 60, showText = true, className = "" }) => {
  const logoSize = showText ? size * 0.6 : size;
  
  return (
    <div className={`freightiq-logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Company logo image */}
      <div 
        className="logo-icon" 
        style={{ 
          width: logoSize, 
          height: logoSize,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <img 
          src={logoImage} 
          alt="FreightIQ Logo" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />
      </div>
      
      {showText && (
        <div className="logo-text-container">
          <div className="logo-text">FreightIQ</div>
          <div className="logo-tagline">Brains behind the quote!</div>
        </div>
      )}
    </div>
  );
};

export default FreightIQLogo;