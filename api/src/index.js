const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport'); 

const authRoutes = require('./router/authRoutes');
const drillRoutes = require('./router/drillRoutes');
const attemptRoutes = require('./router/attemptRoutes');
const userRoutes = require('./router/userRoutes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.WEB_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Session middleware (ADD THIS)
app.use(session({
  secret: process.env.SESSION_SECRET || 'someRandomSecret', // Use environment variable
  resave: false,
  saveUninitialized: false,
  cookie: {
   secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Initialize Passport (ADD THIS)
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100
});
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/api/drills', drillRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;