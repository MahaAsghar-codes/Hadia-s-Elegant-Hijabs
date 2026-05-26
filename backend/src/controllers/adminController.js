const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboardStats = asyncHandler(async (_req, res) => {
  const [users, products, orders, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, revenue: { $sum: '$total' } } }
    ])
  ]);

  res.json({
    users,
    products,
    orders,
    revenue: revenueAgg[0]?.revenue || 0
  });
});
