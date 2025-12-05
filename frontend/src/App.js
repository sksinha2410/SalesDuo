import React, { useState } from 'react';
import './App.css';
import AsinInput from './components/AsinInput';
import ComparisonView from './components/ComparisonView';
import HistoryView from './components/HistoryView';
import { processAsin } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [currentAsin, setCurrentAsin] = useState('');

  const handleAsinSubmit = async (asin) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await processAsin(asin);
      setResult(response.data);
      setCurrentAsin(asin);
    } catch (err) {
      setError(err.message || 'An error occurred while processing the ASIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SalesDuo - Amazon Listing Optimizer</h1>
        <p>Optimize your Amazon product listings with AI</p>
      </header>

      <main className="App-main">
        <AsinInput onSubmit={handleAsinSubmit} loading={loading} />

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && <ComparisonView data={result} />}

        {currentAsin && <HistoryView asin={currentAsin} />}
      </main>

      <footer className="App-footer">
        <p>© 2024 SalesDuo - Built with React, Node.js, and OpenAI</p>
      </footer>
    </div>
  );
}

export default App;
