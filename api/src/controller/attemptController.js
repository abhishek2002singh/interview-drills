const Attempt = require('../models/attempt');
const scoringService = require('../service/scoring');

const submitAttempt = async (req, res, next) => {
  try {
    const { drillId, answers } = req.body;
    const userId = req.user.id;

    // Get the drill to score answers
    const drill = await Drill.findById(drillId);
    if (!drill) {
      return res.status(404).json({ error: 'Drill not found' });
    }

    // Calculate score
    const score = scoringService.calculateScore(drill.questions, answers);

    // Save attempt
    const attempt = new Attempt({
      userId,
      drillId,
      answers,
      score
    });
    await attempt.save();

    res.status(201).json({ score });
  } catch (err) {
    next(err);
  }
};

const getUserAttempts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const attempts = await Attempt.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('drillId', 'title difficulty');

    res.json(attempts);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitAttempt,
  getUserAttempts
};