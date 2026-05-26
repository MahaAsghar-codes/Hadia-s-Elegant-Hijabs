const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getStats = async (req, res, next) => {
  try {
    const [users, products, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments()
    ]);

    const totalSalesResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      users,
      products,
      orders,
      totalSales: totalSalesResult[0]?.total || 0
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getUsers };
