import React from 'react';
import './ComparisonView.css';

function ComparisonView({ data }) {
  if (!data) return null;

  const { original, optimized } = data;

  return (
    <div className="comparison-container">
      <h2>Original vs Optimized Listing</h2>
      <p className="asin-label">ASIN: <strong>{data.asin}</strong></p>

      <div className="comparison-grid">
        {/* Original Column */}
        <div className="comparison-column original">
          <h3>Original</h3>

          <div className="section">
            <h4>Title</h4>
            <p className="content">{original.title}</p>
          </div>

          <div className="section">
            <h4>Bullet Points</h4>
            <ul className="bullet-list">
              {original.bulletPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h4>Description</h4>
            <p className="content description">{original.description}</p>
          </div>
        </div>

        {/* Optimized Column */}
        <div className="comparison-column optimized">
          <h3>Optimized</h3>

          <div className="section">
            <h4>Title</h4>
            <p className="content">{optimized.title}</p>
          </div>

          <div className="section">
            <h4>Bullet Points</h4>
            <ul className="bullet-list">
              {optimized.bulletPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h4>Description</h4>
            <p className="content description">{optimized.description}</p>
          </div>

          <div className="section keywords">
            <h4>Suggested Keywords</h4>
            <div className="keyword-tags">
              {optimized.keywords.map((keyword, idx) => (
                <span key={idx} className="keyword-tag">{keyword}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonView;
