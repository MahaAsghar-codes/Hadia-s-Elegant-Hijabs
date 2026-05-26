const Product = require('../models/Product');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const ensureObjectId = require('../utils/validateObjectId');

exports.getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json(user.cart);
});

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const safeProductId = ensureObjectId(productId, 'product id');
  const product = await Product.findById(safeProductId);
  if (!product) throw new ApiError('Product not found.', 404);

  const user = await User.findById(req.user._id);
  const existing = user.cart.find((item) => item.product.toString() === safeProductId);

  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    user.cart.push({ product: safeProductId, quantity: Number(quantity) });
  }

  await user.save();
  const populated = await User.findById(req.user._id).populate('cart.product');
  res.status(201).json(populated.cart);
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const safeProductId = ensureObjectId(req.params.productId, 'product id');
  const user = await User.findById(req.user._id);
  const item = user.cart.find((cartItem) => cartItem.product.toString() === safeProductId);

  if (!item) throw new ApiError('Cart item not found.', 404);
  if (quantity < 1) throw new ApiError('Quantity must be at least 1.', 400);

  item.quantity = Number(quantity);
  await user.save();

  const populated = await User.findById(req.user._id).populate('cart.product');
  res.json(populated.cart);
});

exports.removeCartItem = asyncHandler(async (req, res) => {
  const safeProductId = ensureObjectId(req.params.productId, 'product id');
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((cartItem) => cartItem.product.toString() !== safeProductId);
  await user.save();
  res.json({ message: 'Item removed from cart.' });
});

exports.clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ message: 'Cart cleared.' });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const safeProductId = ensureObjectId(req.params.productId, 'product id');
  const product = await Product.findById(safeProductId);
  if (!product) throw new ApiError('Product not found.', 404);

  const user = await User.findById(req.user._id);
  const index = user.wishlist.findIndex((id) => id.toString() === safeProductId);

  if (index >= 0) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(safeProductId);
  }

  await user.save();
  const populated = await User.findById(req.user._id).populate('wishlist');
  res.json(populated.wishlist);
});
