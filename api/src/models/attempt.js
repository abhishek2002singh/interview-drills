const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
});

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  drillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drill',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

attemptSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Attempt', attemptSchema);