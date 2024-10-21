const bcrypt = require('bcrypt');
const { Doctor, Clinic, User } = require('../models/Models');

const adddoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, fees, contact, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            specialization,
            fees,
            contact,
            address,
        });

        const savedDoctor = await newDoctor.save();
        res.status(201).json(savedDoctor);
    } catch (error) {
        res.status(500).json({ error: "Failed to add doctor" });
    }
};

const updatedoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ error: "Failed to update doctor" });
    }
};

const removedoctor = async (req, res) => {
    try {
        const { id } = req.params;
        await Doctor.findByIdAndDelete(id);
        res.status(200).json({ message: "Doctor removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove doctor" });
    }
};

const viewdoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ error: "Failed to view doctor" });
    }
};

const viewallDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve doctors" });
    }
};

const addclinic = async (req, res) => {
    try {
        const { name, location, contact } = req.body;
        const image = req.file ? req.file.path : null;

        const newClinic = new Clinic({
            name,
            location,
            contact,
            image,
        });

        const savedClinic = await newClinic.save();
        res.status(201).json(savedClinic);
    } catch (error) {
        res.status(500).json({ error: "Failed to add clinic" });
    }
};

const viewclinic = async (req, res) => {
    try {
        const clinic = await Clinic.findOne();
        if (!clinic) {
            return res.status(404).json({ error: "Clinic not found" });
        }
        
        res.status(200).json(clinic);
    } catch (error) {
        res.status(500).json({ error: "Failed to view clinic" });
    }
};

const updateclinic = async (req, res) => {
    try {
        const updatedClinic = await Clinic.findOneAndUpdate({}, req.body, { new: true });
        res.status(200).json(updatedClinic);
    } catch (error) {
        res.status(500).json({ error: "Failed to update clinic" });
    }
};

const removeclinic = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Clinic.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: "Clinic not found" });
        }
        res.status(200).json({ message: "Clinic removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove clinic" });
    }
};

const viewusers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve users" });
    }
};

module.exports = {
    adddoctor,
    updatedoctor,
    removedoctor,
    viewdoctor,
    viewallDoctors,
    addclinic,
    viewclinic,
    updateclinic,
    removeclinic,
    viewusers,
};
