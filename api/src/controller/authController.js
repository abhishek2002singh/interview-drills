const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const googleAuth = (req, res) => {
  // Passport will handle the actual authentication
};

const googleCallback = (req, res, next) => {
  // Successful authentication, generate JWT
  const token = jwt.sign(
    { id: req.user._id, email: req.user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie(process.env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000, // 1 hour
    sameSite: 'lax'
  });

  res.redirect('/dashboard');
};

const logout = (req, res) => {
  res.clearCookie(process.env.SESSION_COOKIE_NAME);
  res.json({ ok: true });
};

const getCurrentUser = (req, res, next) => {
  if (!req.user) return next(createError(401, 'Not authenticated'));
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture
  });
};

module.exports = {
  googleAuth,
  googleCallback,
  logout,
  getCurrentUser
};