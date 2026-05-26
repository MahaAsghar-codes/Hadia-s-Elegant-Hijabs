const express = require('express');
const { body } = require('express-validator');
const { signup, login, adminLogin, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
];

router.post('/signup', authLimiter, [body('name').notEmpty().withMessage('Name is required.'), ...loginValidation], signup);
router.post('/login', authLimiter, loginValidation, login);
router.post('/admin/login', authLimiter, loginValidation, adminLogin);
router.get('/me', protect, getProfile);

module.exports = router;
