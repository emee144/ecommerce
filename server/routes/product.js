const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// GET /api/products
// ==========================================
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Get all products error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

// Get products belonging to logged-in user
// GET /api/products/my
// ==========================================
router.get('/my', protect, async (req, res) => {
  try {
    console.log('Logged-in user ID:', req.user._id);

    const products = await Product.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    console.log('My products:', products);

    res.json(products);
  } catch (error) {
    console.error('Get my products error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

// ==========================================
// Create product
// POST /api/products
// ==========================================
router.post('/', protect, async (req, res) => {
  try {
    console.log('Creating product for user:', req.user._id);

    const product = await Product.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);

    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;