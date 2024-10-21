
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const adminRoutes = require('./routes/adminroutes');
const userRoutes = require('./routes/UserRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use(cors());
app.use(morgan('dev')); 

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Doctor_Appointment_System')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user', userRoutes);

app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
