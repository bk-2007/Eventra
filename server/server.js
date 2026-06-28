const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();

// Middlewares
app.use(cors({ origin: ["http://localhost:5173", "https://eventraa.vercel.app"] }));
app.use(express.json());

// Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/register', registrationRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/certificate', certificateRoutes);

// Root route for sanity check
app.get('/', (req, res) => {
  res.send('Eventra Backend Server is running.');
});

// Database connection & listener
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventra';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB database.');
    app.listen(PORT, () => {
      console.log(`Express server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
