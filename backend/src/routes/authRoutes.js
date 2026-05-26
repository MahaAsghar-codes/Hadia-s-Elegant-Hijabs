const express = require('express');
const { body } = require('express-validator');
const { signup, login, adminLogin, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const loginValidation = [body('email').isEmail().withMessage('Valid email is required.'), body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')];

router.post('/signup', [body('name').notEmpty().withMessage('Name is required.'), ...loginValidation], signup);
router.post('/login', loginValidation, login);
router.post('/admin/login', loginValidation, adminLogin);
router.get('/me', protect, getProfile);

module.exports = router;
