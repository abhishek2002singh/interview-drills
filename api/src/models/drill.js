const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true
  },
  keywords: [{
    type: String,
    required: true
  }]
});

const drillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  tags: [{
    type: String
  }],
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

drillSchema.index({ tags: 1 });
drillSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Drill', drillSchema);