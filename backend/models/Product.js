// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  // Add any additional fields such as category, stock, etc.
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
