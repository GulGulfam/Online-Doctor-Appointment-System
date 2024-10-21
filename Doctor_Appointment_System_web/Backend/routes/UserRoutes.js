const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  registerUser,
  loginUser,
  createProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  viewAppointment,
  viewallAppointments
} = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // File naming convention
  }
});
const upload = multer({ storage: storage });

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/profile', authMiddleware, upload.single('image'), createProfile);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, upload.single('image'), updateUserProfile);
router.delete('/profile', authMiddleware, deleteUserProfile);

// Appointment routes
router.post('/appointments', createAppointment);
router.put('/appointments/update/:id', updateAppointment);
router.delete('/appointments/delete/:id', deleteAppointment);
router.get('/appointments/view/:id', viewAppointment);
router.get('/appointments', viewallAppointments);

module.exports = router;
