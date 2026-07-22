// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Reference to the admin or user who placed the order (if you have users)
  // For now we store a simple string identifier
  buyer: { type: String, required: true },
  // List of ordered products with quantity
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
