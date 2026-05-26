const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      city: String,
      address: String,
      phone: String
    },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
