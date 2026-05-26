const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const ensureObjectId = require('../utils/validateObjectId');

const refreshProductRating = async (productId) => {
  const agg = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        ratingAverage: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratingAverage: agg[0]?.ratingAverage || 0,
    ratingCount: agg[0]?.ratingCount || 0
  });
};

exports.getProductReviews = asyncHandler(async (req, res) => {
  const productId = ensureObjectId(req.params.productId, 'product id');
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort('-createdAt');
  res.json(reviews);
});

exports.upsertReview = asyncHandler(async (req, res) => {
  const productId = ensureObjectId(req.params.productId, 'product id');
  const product = await Product.findById(productId);
  if (!product) throw new ApiError('Product not found.', 404);
  const rating = Number(req.body.rating);
  const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';
  const filter = mongoose.sanitizeFilter({ user: req.user._id, product: productId });

  const review = await Review.findOneAndUpdate(
    filter,
    {
      user: req.user._id,
      product: productId,
      rating,
      comment
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await refreshProductRating(product._id);
  res.status(201).json(review);
});
