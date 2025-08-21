const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  picture: {
    type: String,
    default: ''
  },
  providers: [{
    provider: {
      type: String,
      required: true
    },
    providerId: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);