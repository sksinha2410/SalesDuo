import React, { useState, useEffect } from 'react';
import { getAsinHistory } from '../services/api';
import './HistoryView.css';

function HistoryView({ asin }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (asin) {
      fetchHistory();
    }
  }, [asin]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAsinHistory(asin);
      setHistory(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="history-container">Loading history...</div>;
  }

  if (error) {
    return <div className="history-container error">Error: {error}</div>;
  }

  if (!history || history.length === 0) {
    return (
      <div className="history-container">
        <h3>History</h3>
        <p>No previous optimizations found for this ASIN.</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h3>Optimization History for {asin}</h3>
      <div className="history-list">
        {history.map((item) => (
          <div
            key={item.id}
            className={`history-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
            onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
          >
            <div className="history-item-header">
              <span className="history-date">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
            <div className="history-item-title">
              {item.optimized_title.substring(0, 100)}
              {item.optimized_title.length > 100 && '...'}
            </div>

            {selectedItem?.id === item.id && (
              <div className="history-item-details">
                <div className="detail-section">
                  <strong>Original Title:</strong>
                  <p>{item.original_title}</p>
                </div>
                <div className="detail-section">
                  <strong>Optimized Title:</strong>
                  <p>{item.optimized_title}</p>
                </div>
                <div className="detail-section">
                  <strong>Suggested Keywords:</strong>
                  <div className="keyword-tags">
                    {item.suggested_keywords.map((keyword, idx) => (
                      <span key={idx} className="keyword-tag">{keyword}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryView;
