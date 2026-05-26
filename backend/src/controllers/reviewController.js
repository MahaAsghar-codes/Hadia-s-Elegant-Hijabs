const Product = require('../models/Product');
const Review = require('../models/Review');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

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
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort('-createdAt');
  res.json(reviews);
});

exports.upsertReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError('Product not found.', 404);

  const review = await Review.findOneAndUpdate(
    { user: req.user._id, product: req.params.productId },
    {
      user: req.user._id,
      product: req.params.productId,
      rating: req.body.rating,
      comment: req.body.comment
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await refreshProductRating(product._id);
  res.status(201).json(review);
});
