const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Process a new ASIN
 */
export const processAsin = async (asin) => {
  const response = await fetch(`${API_BASE_URL}/products/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ asin }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to process ASIN');
  }

  return data;
};

/**
 * Get history for a specific ASIN
 */
export const getAsinHistory = async (asin) => {
  const response = await fetch(`${API_BASE_URL}/products/history/${asin}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch history');
  }

  return data;
};

/**
 * Get all optimizations
 */
export const getAllOptimizations = async (limit = 50, offset = 0) => {
  const response = await fetch(
    `${API_BASE_URL}/products/optimizations?limit=${limit}&offset=${offset}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch optimizations');
  }

  return data;
};

/**
 * Get optimization by ID
 */
export const getOptimizationById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/optimization/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch optimization');
  }

  return data;
};
