const User = require('../models/User');
const { isValidObjectId } = require('../utils/validators');

const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price image');
    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!isValidObjectId(productId)) return res.status(400).json({ message: 'Invalid product id' });
    const user = await User.findById(req.user._id);

    const index = user.wishlist.findIndex((id) => id.toString() === productId);
    if (index >= 0) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    res.json({ message: 'Wishlist updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, toggleWishlist };
