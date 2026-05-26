const express = require('express');
const { body } = require('express-validator');
const { submitContact } = require('../controllers/contactController');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.post(
  '/',
  authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('subject').notEmpty().withMessage('Subject is required.'),
    body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters.')
  ],
  submitContact
);

module.exports = router;
