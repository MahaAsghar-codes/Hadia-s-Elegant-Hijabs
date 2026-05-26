const User = require('../models/User');
const Order = require('../models/Order');

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user.cart.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = user.cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }));

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalPrice
    });

    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
