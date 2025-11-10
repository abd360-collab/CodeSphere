const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate', aiController.generate);
router.post('/review', aiController.review);
router.post('/explain', aiController.explain);

module.exports = router;
