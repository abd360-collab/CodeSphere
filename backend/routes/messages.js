const express = require('express');
const { body, param } = require('express-validator');
const { getMessages, createMessage } = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Validation rules
const messageValidation = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
];

const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID')
];

// Routes
router.get('/:id', mongoIdValidation, getMessages);
router.post('/:id', [...mongoIdValidation, ...messageValidation], createMessage);

module.exports = router;
