const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Profile, Appointment } = require('../models/UserModels');

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const payload = { id: user.id, email: user.email, name: user.name }; 
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token, name: user.name });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a user profile
exports.createProfile = async (req, res) => {
  const { name, email, age, gender, contact } = req.body;
  const userId = req.user.id; 
  const image = req.file ? req.file.path : null;

  try {
    let profile = await Profile.findOne({ user: userId });
    if (profile) {
      return res.status(400).json({ message: "Profile already exists" });
    }
    profile = new Profile({
      user: userId,
      name,
      email,
      age,
      gender,
      contact,
      image,
    });
    await profile.save();
    res.status(201).json({ message: "Profile created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a user's profile
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user's profile
exports.updateUserProfile = async (req, res) => {
  const { name, email, age, gender, contact } = req.body;
  const userId = req.user.id;
  const image = req.file ? req.file.path : null;

  try {
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { name, email, age, gender, contact, image } },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user's profile
exports.deleteUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const profile = await Profile.findOneAndDelete({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Create an appointment
exports.createAppointment = async (req, res) => {
  const { name, email, age, gender, contact, specialization, doctorName, appointmentDate, timeSlot, accountType, accountName, accountNumber } = req.body;
  try {
    const appointment = new Appointment({
      name,
      email,
      age,
      gender,
      contact,
      specialization,
      doctorName,
      appointmentDate,
      timeSlot,
      accountType,
      accountName,
      accountNumber,
    });
    await appointment.save();
    res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;  
  const { name, email, age, gender, contact, specialization, doctorName, appointmentDate, timeSlot, accountType, accountName, accountNumber } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: { name, email, age, gender, contact, specialization, doctorName, appointmentDate, timeSlot, accountType, accountName, accountNumber } },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;  

  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// View an appointment
exports.viewAppointment = async (req, res) => {
  const { id } = req.params;  

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// View all appointments
exports.viewallAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
