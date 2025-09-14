// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// --- Middleware ---
// CORS: allow frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Parse JSON from frontend
app.use(express.json({ limit: '2mb' }));

// Logging
app.use(morgan('dev'));

// --- Connect MongoDB ---
connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

// --- Routes ---
app.get('/', (req, res) => res.json({ success: true, message: 'School Payments API' }));

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Payment routes
app.use('/api/payments', require('./routes/paymentRoutes'));

// Other API routes
app.use('/api', require('./routes/webhookRoutes'));
app.use('/api', require('./routes/transactionRoutes'));

// --- Error handler ---
app.use(errorHandler);

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 School Payments Dashboard Backend running on port ${PORT}`);
});
