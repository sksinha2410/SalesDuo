/**
 * SalesDuo API Usage Examples
 * 
 * This file demonstrates how to use the SalesDuo API in Node.js
 * Run with: node examples/api-usage.js
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Example 1: Process a new ASIN
 */
async function processAsin(asin) {
  console.log(`\n=== Processing ASIN: ${asin} ===\n`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ asin }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Optimization successful!\n');
      console.log('Original Title:', data.data.original.title);
      console.log('\nOptimized Title:', data.data.optimized.title);
      console.log('\nSuggested Keywords:', data.data.optimized.keywords.join(', '));
      console.log('\nOptimization ID:', data.data.id);
    } else {
      console.error('❌ Error:', data.error);
    }

    return data;
  } catch (error) {
    console.error('❌ Network error:', error.message);
    throw error;
  }
}

/**
 * Example 2: Get history for an ASIN
 */
async function getAsinHistory(asin) {
  console.log(`\n=== Getting history for ASIN: ${asin} ===\n`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/history/${asin}`);
    const data = await response.json();

    if (data.success) {
      console.log(`✅ Found ${data.data.length} optimization(s)\n`);
      
      data.data.forEach((item, index) => {
        console.log(`${index + 1}. Optimization from ${new Date(item.created_at).toLocaleString()}`);
        console.log(`   Title: ${item.optimized_title.substring(0, 80)}...`);
      });
    } else {
      console.error('❌ Error:', data.error);
    }

    return data;
  } catch (error) {
    console.error('❌ Network error:', error.message);
    throw error;
  }
}

/**
 * Example 3: Get all optimizations
 */
async function getAllOptimizations(limit = 10) {
  console.log(`\n=== Getting last ${limit} optimizations ===\n`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/optimizations?limit=${limit}`);
    const data = await response.json();

    if (data.success) {
      console.log(`✅ Found ${data.data.length} optimization(s)\n`);
      
      data.data.forEach((item, index) => {
        console.log(`${index + 1}. ASIN: ${item.asin}`);
        console.log(`   Original: ${item.original_title.substring(0, 60)}...`);
        console.log(`   Optimized: ${item.optimized_title.substring(0, 60)}...`);
        console.log(`   Date: ${new Date(item.created_at).toLocaleString()}\n`);
      });
    } else {
      console.error('❌ Error:', data.error);
    }

    return data;
  } catch (error) {
    console.error('❌ Network error:', error.message);
    throw error;
  }
}

/**
 * Example 4: Check API health
 */
async function checkHealth() {
  console.log('\n=== Checking API health ===\n');
  
  try {
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();

    if (data.status === 'ok') {
      console.log('✅ API is healthy!');
      console.log('Message:', data.message);
    } else {
      console.error('❌ API is not healthy');
    }

    return data;
  } catch (error) {
    console.error('❌ Cannot connect to API:', error.message);
    throw error;
  }
}

/**
 * Main function - displays usage
 */
async function main() {
  console.log(`
SalesDuo API Usage Examples

Available functions:
- processAsin(asin)         - Process a new ASIN
- getAsinHistory(asin)      - Get optimization history
- getAllOptimizations(limit)- Get all optimizations
- checkHealth()             - Check API health

Example usage:
  const { processAsin } = require('./examples/api-usage.js');
  await processAsin('B08N5WRWNW');

Or run individual examples:
  node -e "require('./examples/api-usage.js').processAsin('B08N5WRWNW')"
  `);
}

// Run main function if executed directly
if (require.main === module) {
  main().catch(console.error);
}

// Export functions for use in other modules
module.exports = {
  processAsin,
  getAsinHistory,
  getAllOptimizations,
  checkHealth,
};
