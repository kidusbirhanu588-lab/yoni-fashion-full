const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ==================== DEFAULT ADMIN AUTO-SEED ====================
// Automatically creates the default admin account if it doesn't exist.
// Credentials: username=admin / password=Yonatan@122129
const seedDefaultAdmin = async () => {
  try {
    const existing = await AdminUser.findOne({ username: 'admin' });
    if (!existing) {
      const hashed = await bcrypt.hash('Yonatan@122129', 10);
      await AdminUser.create({ username: 'admin', password: hashed });
      console.log('✅ Default admin account created (admin / Yonatan@122129)');
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};
seedDefaultAdmin();

// ==================== ADMIN LOGIN ====================
// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  try {
    // 1. Try database lookup first
    const user = await AdminUser.findOne({ username });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '8h' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'none' });
      return res.json({ success: true, message: 'Login successful', token });
    }

    // 2. Fallback: hardcoded credentials (in case DB is not yet seeded)
    if (username === 'admin' && password === 'Yonatan@122129') {
      const token = jwt.sign({ id: 'hardcoded-admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '8h' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'none' });
      return res.json({ success: true, message: 'Login successful', token });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== PROTECTED ADMIN ROUTES ====================
// All routes below this line require a valid JWT token
router.use(authMiddleware);

// ---------- Products ----------

// GET /api/admin/products – list all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/products – create a product
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid data', error: err.message });
  }
});

// PUT /api/admin/products/:id – update a product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid data', error: err.message });
  }
});

// DELETE /api/admin/products/:id – delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ---------- Orders ----------

// GET /api/admin/orders – list all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/orders/:id – update order status
router.put('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid data' });
  }
});

// ---------- Reviews ----------

// GET /api/admin/reviews – list all reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/reviews/:id/approve – approve a review
router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/reviews/:id – delete a review
router.delete('/reviews/:id', async (req, res) => {
  try {
    const result = await Review.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
