const Order = require('../models/Order');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

exports.createOrderFromCart = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'COD', shippingFee = 0 } = req.body;
  const user = await User.findById(req.user._id).populate('cart.product');

  if (!user.cart.length) throw new ApiError('Cart is empty.', 400);

  const items = user.cart.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images[0],
    quantity: item.quantity,
    price: item.product.price
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + Number(shippingFee);

  const order = await Order.create({
    user: user._id,
    items,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee,
    total
  });

  user.cart = [];
  await user.save();

  res.status(201).json(order);
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(orders);
});

exports.getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.json(orders);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError('Order not found.', 404);

  order.status = req.body.status;
  await order.save();
  res.json(order);
});
