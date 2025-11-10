const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    //The frontend sends the token inside the request header (like a hidden message).
    //example - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
   //This line pulls out the token part (eyJhbGciOi...) by removing "Bearer ".
   //If no token exists, token will be undefined.
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password'); // excluding password field from user-info.
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
