const User = require('../models/User');
const Product = require('../models/Product');

const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product', 'name price image stock');
    res.json(user.cart);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(req.user._id);
    const existing = user.cart.find((item) => item.product.toString() === productId);

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      user.cart.push({ product: productId, quantity: Number(quantity) });
    }

    await user.save();
    res.status(201).json({ message: 'Cart updated' });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.find((cartItem) => cartItem.product.toString() === req.params.productId);

    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = Math.max(1, Number(quantity));
    await user.save();

    res.json({ message: 'Cart item updated' });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((item) => item.product.toString() !== req.params.productId);
    await user.save();

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
