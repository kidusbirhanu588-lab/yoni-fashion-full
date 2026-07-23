require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5000',
    'http://localhost:3000',
    'https://yoni-fashion-frontend.netlify.app',
    /\.netlify\.app$/,   // allows any netlify subdomain
  ],
  credentials: true,
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "http:", "https:"],
      connectSrc: ["'self'", "http:", "https:"],
    },
  },
}));
app.use(morgan('dev'));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ==================== PUBLIC API ROUTES ====================
const Product = require('./models/Product');
const Review = require('./models/Review');
const Order = require('./models/Order');

// GET /api/products – Public: fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/reviews – Public: fetch approved reviews only
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/orders – Public: submit a new order
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid order data', error: err.message });
  }
});

// POST /api/reviews – Public: submit a review (pending approval)
app.post('/api/reviews', async (req, res) => {
  try {
    const review = new Review({ ...req.body, approved: false });
    await review.save();
    res.status(201).json({ success: true, message: 'Review submitted for approval' });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid review data', error: err.message });
  }
});

// API TEST
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Yoni Fashion API is live ✅' });
});

// Admin routes
const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);

// Serve frontend folder (must come AFTER API routes)
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all: serve index.html for any non-API route (SPA support)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
