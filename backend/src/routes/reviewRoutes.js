const express = require('express');
const { body } = require('express-validator');
const { getProductReviews, upsertReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.get('/', getProductReviews);
router.post(
  '/',
  protect,
  [body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.')],
  upsertReview
);

module.exports = router;
