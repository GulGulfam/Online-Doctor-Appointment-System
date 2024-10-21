const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Appointment} = require('../models/AppointmentModels');
exports.createAppointment = async (req, res) => {
    const { name, fullName, age, gender, contact, specialization, doctorName, appointmentDate, timeSlot, accountType, accountName, accountNumber } = req.body;
    try {
      const appointment = new Appointment({
        name,
        fullName,
        age,
        gender,
       
      });
      await appointment.save();
      res.status(201).json({ message: "Appointment created successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  