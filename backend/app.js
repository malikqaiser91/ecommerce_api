const express = require('express');
const connectDB = require('./config/db');
const errorMiddleware = require('./middlewares/errors');
const dotenv = require('dotenv').config({
  path: './backend/config/config.env',
});
const cookieParser = require('cookie-parser');
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie Parser
app.use(cookieParser());

// Connect DB
connectDB();

// Imports all routes
const products = require('./routes/productRoutes');
const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const admin = require('./routes/adminRoutes');
const order = require('./routes/orderRoutes');
const review = require('./routes/reviewRoutes');

// Mounting the routes
app.use('/api/v1/products', products);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/admin', admin);
app.use('/api/v1/order', order);
app.use('/api/v1/review', review);

// Error Handling
app.use(errorMiddleware);

module.exports = app;
