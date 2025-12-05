import React, { useState } from 'react';
import './AsinInput.css';

function AsinInput({ onSubmit, loading }) {
  const [asin, setAsin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate ASIN format (typically 10 characters alphanumeric)
    if (!asin || asin.trim().length < 10) {
      setError('Please enter a valid ASIN (at least 10 characters)');
      return;
    }

    onSubmit(asin.trim());
  };

  return (
    <div className="asin-input-container">
      <h2>Enter Amazon ASIN</h2>
      <form onSubmit={handleSubmit} className="asin-form">
        <div className="input-group">
          <input
            type="text"
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            placeholder="e.g., B08N5WRWNW"
            className="asin-input"
            disabled={loading}
          />
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Processing...' : 'Optimize'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
      <p className="help-text">
        Enter an Amazon ASIN (Amazon Standard Identification Number) to fetch and optimize the product listing.
      </p>
    </div>
  );
}

export default AsinInput;
