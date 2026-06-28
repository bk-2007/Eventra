const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');

      // Add user to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized: User not found' });
      }
      
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized: Token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized: No token provided' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Administrators only' });
  }
};

module.exports = { protect, isAdmin };
