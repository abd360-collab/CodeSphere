// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const auth = async (req, res, next) => {
//   try {
//     //The frontend sends the token inside the request header (like a hidden message).
//     //example - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
//    //This line pulls out the token part (eyJhbGciOi...) by removing "Bearer ".
//    //If no token exists, token will be undefined.
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select('-password'); // excluding password field from user-info.
    
//     if (!user) {
//       return res.status(401).json({ message: 'Token is not valid' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = auth;



const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const auth = async (req, res, next) => {
  try {
    // 1. Extract Token
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : null;

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🛡️ CRITICAL FIX: 
    // Check if your JWT uses 'userId' or just 'id'. 
    // Most Prisma setups use { id: user.id }. 
    // If decoded.userId is undefined, Prisma findUnique will throw a server error.
    const targetId = decoded.userId || decoded.id;

    if (!targetId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // 3. Find User in Postgres via Prisma
    const user = await prisma.user.findUnique({
      where: { id: targetId },
      select: {
        id: true,
        username: true,
        email: true,
        // Password is automatically excluded because we didn't select it
      },
    });

    // 4. Handle Case where user was deleted but token is still active
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // 5. Attach clean object to request
    // We use 'id' here so it matches your Project Controller's checks
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    
    // Distinguish between expired tokens and general server errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;