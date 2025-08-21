const express = require('express');
const Drill = require('../models/drill');
const cache = require('../middleware/cache');

const router = express.Router();

// Cache middleware for GET routes
const cacheMiddleware = cache(60); // 60 seconds cache

// Get all drills
router.get('/', cacheMiddleware, async (req, res) => {
  try {
    const drills = await Drill.find().select('-questions');
    res.json(drills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drills' });
  }
});

// Get drill by ID
router.get('/:id', cacheMiddleware, async (req, res) => {
  try {
    const drill = await Drill.findById(req.params.id);
    if (!drill) {
      return res.status(404).json({ error: 'Drill not found' });
    }
    res.json(drill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drill' });
  }
});

module.exports = router;