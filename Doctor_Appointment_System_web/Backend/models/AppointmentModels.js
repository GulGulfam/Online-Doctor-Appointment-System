const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  specialization: { type: String, required: true },
  doctorName: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  accountType: { type: String },
  accountName: { type: String },
  accountNumber: { type: String }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = { Appointment };

