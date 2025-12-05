const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Process a new ASIN
router.post('/process', productController.processAsin);

// Get history for a specific ASIN
router.get('/history/:asin', productController.getAsinHistory);

// Get all optimizations
router.get('/optimizations', productController.getAllOptimizations);

// Get a specific optimization by ID
router.get('/optimization/:id', productController.getOptimizationById);

module.exports = router;
