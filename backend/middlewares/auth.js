const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Try to get token from cookie first, then fall back to Authorization header
  let token = req.cookies?.auth_token;
  
  if (!token) {
    const authHeader = req.headers.authorization || '';
    token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  }
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = payload; 
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

module.exports = { auth, requireRole };
