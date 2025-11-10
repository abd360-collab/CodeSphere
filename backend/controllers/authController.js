const jwt = require('jsonwebtoken'); // library to create and verify JWT tokens.
const { validationResult } = require('express-validator'); // validates request body (e.g., ensures email is in valid format).
const User = require('../models/User'); // our Mongoose User model (with schema + password hashing).


// jwt.sign(payload, secret, options)
// Payload = { userId } (we only put the user’s ID inside the token).
// Secret = JWT_SECRET from .env.
// expiresIn: '7d' → token will expire after 7 days.
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Creates Token. This token will be sent to frontend → stored (localStorage/cookie) → attached in requests → backend verifies.
};



const register = async (req, res) => {
  // First step → validate input. If bad, return 400 Bad Request.
  try {

    // This line reads all the validation errors from the request.
    // If there are no errors → errors.isEmpty() is true.
    // If there are errors → errors.array() gives you a list of what went wrong.
    const errors = validationResult(req); // checks if req contains errors.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body; // Extract input fields.

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    }); // checks if email OR username already exists.

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    } // If duplicate found, send error message.

    // Create new user
    // Important: remember from model → the password will be hashed automatically by the pre-save hook before saving.
    const user = new User({ username, email, password });
    await user.save();


    // After saving, generate a JWT token.
    const token = generateToken(user._id);


    // Respond with 201 Created → along with user data and token.
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};


// Step 1: validate input.
// Step 2: find user by email.
// If user not found → “Invalid credentials”.
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    // Use our comparePassword method → returns true if match, else false.
    // If not match → error.
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};



// Assumes req.user has already been set (via a middleware that decodes JWT).
// Simply returns user’s data.

// Frontend sends JWT in headers.
// Middleware decodes token, attaches user to req.user.
// getMe returns profile info.

const getMe = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe
};





// Region of Improvements:

// But currently, token is just returned in JSON → probably stored in localStorage. This can be stolen by XSS.
// Better: set token in httpOnly cookies (can’t be accessed by JS).
// Should also add:
// Rate limiting (prevent brute force).
// Stronger validation for email format.
// Password strength rules.