const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    fees: { type: Number, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ClinicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    image: { type: String },
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
const Clinic = mongoose.model('Clinic', ClinicSchema);

module.exports = { Doctor, Clinic };
