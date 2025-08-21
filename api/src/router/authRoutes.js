const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRETE,
  callbackURL:process.env.GOOGLE_CALLBACK_URL  || 'http://localhost:7777/auth/google/callback'

}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (!user) {
      user = new User({
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos[0].value,
        providers: [{
          provider: 'google',
          providerId: profile.id
        }]
      });
      await user.save();
    } else {
      // Check if Google provider already exists
      const hasGoogleProvider = user.providers.some(p => p.provider === 'google');
      if (!hasGoogleProvider) {
        user.providers.push({
          provider: 'google',
          providerId: profile.id
        });
        await user.save();
      }
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Auth routes
router.get('/google', (req, res, next) => {
  console.log('Initiating Google OAuth with callback:', process.env.GOOGLE_CALLBACK_URL);
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

router.get('/google/callback', 
  (req, res, next) => {
    console.log('Google OAuth callback received');
    passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
  },
  (req, res) => {
    console.log('Google OAuth successful, setting cookie');
    // Create JWT token
    const token = jwt.sign(
      { userId: req.user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    // Set httpOnly cookie
    res.cookie('upivot_sid', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.redirect(process.env.WEB_ORIGIN || 'http://localhost:5173/dashboard');
  }
);

router.get('/logout', (req, res) => {
  res.clearCookie('upivot_sid');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;