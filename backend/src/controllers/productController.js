const scraper = require('../services/scraper');
const aiOptimizer = require('../services/aiOptimizer');
const database = require('../services/database');

/**
 * Process a new ASIN - scrape, optimize, and save
 */
async function processAsin(req, res) {
  try {
    const { asin } = req.body;

    if (!asin) {
      return res.status(400).json({
        success: false,
        error: 'ASIN is required'
      });
    }

    // Step 1: Scrape product data from Amazon
    console.log(`Scraping product data for ASIN: ${asin}`);
    const productData = await scraper.scrapeProduct(asin);

    // Step 2: Optimize with AI
    console.log(`Optimizing product data with AI`);
    const optimized = await aiOptimizer.optimizeProduct(productData);

    // Step 3: Save to database
    console.log(`Saving optimization to database`);
    const optimizationId = await database.saveOptimization({
      asin: productData.asin,
      originalTitle: productData.title,
      originalBulletPoints: productData.bulletPoints,
      originalDescription: productData.description,
      optimizedTitle: optimized.title,
      optimizedBulletPoints: optimized.bulletPoints,
      optimizedDescription: optimized.description,
      suggestedKeywords: optimized.keywords
    });

    // Return the complete result
    res.json({
      success: true,
      data: {
        id: optimizationId,
        asin: productData.asin,
        original: {
          title: productData.title,
          bulletPoints: productData.bulletPoints,
          description: productData.description
        },
        optimized: {
          title: optimized.title,
          bulletPoints: optimized.bulletPoints,
          description: optimized.description,
          keywords: optimized.keywords
        }
      }
    });

  } catch (error) {
    console.error('Process ASIN error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process ASIN'
    });
  }
}

/**
 * Get optimization history for a specific ASIN
 */
async function getAsinHistory(req, res) {
  try {
    const { asin } = req.params;

    if (!asin) {
      return res.status(400).json({
        success: false,
        error: 'ASIN is required'
      });
    }

    const history = await database.getHistoryByAsin(asin);

    res.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch history'
    });
  }
}

/**
 * Get all optimizations
 */
async function getAllOptimizations(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const optimizations = await database.getAllOptimizations(limit, offset);

    res.json({
      success: true,
      data: optimizations
    });

  } catch (error) {
    console.error('Get all optimizations error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch optimizations'
    });
  }
}

/**
 * Get a specific optimization by ID
 */
async function getOptimizationById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Optimization ID is required'
      });
    }

    const optimization = await database.getOptimizationById(id);

    if (!optimization) {
      return res.status(404).json({
        success: false,
        error: 'Optimization not found'
      });
    }

    res.json({
      success: true,
      data: optimization
    });

  } catch (error) {
    console.error('Get optimization error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch optimization'
    });
  }
}

module.exports = {
  processAsin,
  getAsinHistory,
  getAllOptimizations,
  getOptimizationById
};
