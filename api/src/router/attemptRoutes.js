const express = require('express');
const Attempt = require('../models/attempt');
const Drill = require('../models/drill');
const auth = require('../middleware/auth');

const router = express.Router();

// Submit attempt
router.post('/', auth, async (req, res) => {
  try {
    const { drillId, answers } = req.body;
    const userId = req.userId;

    // Validate input
    if (!drillId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Get drill to calculate score
    const drill = await Drill.findById(drillId);
    if (!drill) {
      return res.status(404).json({ error: 'Drill not found' });
    }

    // Calculate score
    let correctCount = 0;
    answers.forEach((answer, index) => {
      const question = drill.questions[index];
      if (question) {
        const userAnswer = answer.text.toLowerCase();
        const keywordMatches = question.keywords.filter(keyword => 
          userAnswer.includes(keyword.toLowerCase())
        );
        if (keywordMatches.length > 0) {
          correctCount++;
        }
      }
    });

    const score = Math.round((correctCount / drill.questions.length) * 100);

    // Create attempt
    const attempt = new Attempt({
      userId,
      drillId,
      answers,
      score
    });

    await attempt.save();
    
    // Populate drill details
    await attempt.populate('drillId', 'title difficulty');
    
    res.status(201).json(attempt);
  } catch (error) {
    console.error('Error submitting attempt:', error);
    res.status(500).json({ error: 'Failed to submit attempt' });
  }
});

// Get user attempts
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const attempts = await Attempt.find({ userId: req.userId })
      .populate('drillId', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

module.exports = router;