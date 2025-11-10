const express = require('express');
// We import body, param from express-validator → these are used to validate inputs
// body() → checks data in the request body (like name, description).
// param() → checks data in the URL (like :id).
const { body, param } = require('express-validator');
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole
} = require('../controllers/projectController');
const auth = require('../middleware/auth');// It ensures that only logged-in users can access these project routes.

// We attach routes to this and then export it.
const router = express.Router(); // Creates a mini Express app (router) only for projects.

// All routes require authentication
// If user doesn’t send a valid JWT token → they get 401 Unauthorized.
router.use(auth);

// Validation rules
// Checks that project details are valid.
// Example: If someone sends an invalid language "php" → error.
// If name is more than 100 characters → error.
const projectValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('language')
    .optional()
    .isIn(['javascript', 'python', 'java', 'cpp', 'html', 'css', 'typescript', 'json'])
    .withMessage('Invalid language'),
  body('code')
    .optional()
    .isString()
    .withMessage('Code must be a string')
];



// When adding a member, check:
// Email is valid.
// Role is correct (owner, editor, viewer).
const memberValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['owner', 'editor', 'viewer'])
    .withMessage('Invalid role')
];


// Used when updating a member’s role.
const roleValidation = [
  body('role')
    .isIn(['owner', 'editor', 'viewer'])
    .withMessage('Invalid role')
];


// Ensures the :id in the URL is a valid MongoDB ObjectId.
const projectIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID')
];


// Ensures the :userId in the URL is valid
const userIdValidation = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID')
];


// When you need both project and user IDs validated (like removing a member).
const projectAndUserIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID')
];

// Routes
// Returns all projects of the logged-in user.
router.get('/', getProjects);
// Creates a new project after validating input.
router.post('/', projectValidation, createProject);
// Returns details of a single project by its ID.
router.get('/:id', projectIdValidation, getProject);
// Updates project details (name, description, etc.).
router.put('/:id', [...projectIdValidation, ...projectValidation], updateProject);
// Deletes a project.
router.delete('/:id', projectIdValidation, deleteProject);



// Member management routes
// Add a new member to project.
router.post('/:id/members', [...projectIdValidation, ...memberValidation], addMember);
// Remove a member from project.
router.delete('/:id/members/:userId', projectAndUserIdValidation, removeMember);
// Change a member’s role (like from viewer to editor).
router.put('/:id/members/:userId/role', [...projectAndUserIdValidation, ...roleValidation], updateMemberRole);

module.exports = router; // Exports the router so it can be used in server.js.
