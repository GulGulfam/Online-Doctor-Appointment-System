const express = require('express');
const router = express.Router();
const { createAppointment} = require('../controllers/AppointmentController');
router.post('/appointments', createAppointment);
module.exports = router;
