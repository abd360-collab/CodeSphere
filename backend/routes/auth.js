const express = require('express');
const { body } = require('express-validator'); // checks if user input is valid (email format, password length, etc.).
const { register, login, getMe } = require('../controllers/authController'); // the chefs (functions) we already wrote.
const auth = require('../middleware/auth'); // checks if user is logged in (JWT validation)


//A router is like a mini Express app just for specific URLs.
const router = express.Router();

// Validation rules
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters') // If error returns this message as error.
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes

// When frontend calls POST /api/auth/register,
// First run registerValidation.
// If valid, call register controller.


// registerValidation runs first → attaches the results of the checks into the req (request object).
// Then your register function runs.
// So after validation, Express adds a “list of validation results” inside req.
router.post('/register', registerValidation, register);
// Same for Login.
router.post('/login', loginValidation, login);


// When frontend calls GET /api/auth/me,
// First run auth middleware (check JWT).
// If valid → run getMe (returns user info).
// If invalid → error “Not authorized”.
router.get('/me', auth, getMe);


// So it can be used in server.js.
module.exports = router;
