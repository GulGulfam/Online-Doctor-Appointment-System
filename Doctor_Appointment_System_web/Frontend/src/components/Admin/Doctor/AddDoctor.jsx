import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddDoctor.css';

const AddDoctor = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        fees: '',
        contact: '',
        address: '',
    });
    const [specializations, setSpecializations] = useState(['Cardiologist', 'Dermatologist', 'Pediatrician']); // Example specialization list
    const [manualSpecialization, setManualSpecialization] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch specializations from server if needed
        // axios.get('http://localhost:5000/api/specializations')
        //     .then(response => setSpecializations(response.data))
        //     .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSpecializationChange = (e) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            specialization: value,
        }));
        if (value !== 'other') {
            setManualSpecialization('');
        }
    };

    const handleManualSpecializationChange = (e) => {
        setManualSpecialization(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!/^[A-Za-z\s]+$/.test(formData.name)) {
            setError('Name can only contain alphabets.');
            return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
            setError('Password must be at least 8 characters long with a mix of letters and digits.');
            return;
        }
        if (formData.fees < 500 || formData.fees > 5000) {
            setError('Fees must be between 500 and 5000.');
            return;
        }
        if (!/^\d{11}$/.test(formData.contact)) {
            setError('Contact must be exactly 11 digits.');
            return;
        }
        if (formData.specialization === 'other') {
            if (!/^[A-Za-z\s]{3,4}$/.test(manualSpecialization)) {
                setError('Manual specialization must be 3 to 4 alphabets.');
                return;
            }
            formData.specialization = manualSpecialization;
        } else if (!formData.specialization) {
            setError('Specialization is required.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/admin/doctor/add', formData);
            alert('Doctor added successfully.');
            setFormData({
                name: '',
                email: '',
                password: '',
                specialization: '',
                fees: '',
                contact: '',
                address: '',
            });
            setManualSpecialization('');
        } catch (err) {
            console.error('Error:', err.response ? err.response.data : err.message);
            alert('Email is already exist.');
        }
    };

    return (
        <div className="add-doctor-container">
            <h1>Add Doctor</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Only alphabets"
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min 8 characters, letters and digits only"
                        required
                    />
                </div>
                <div>
                    <label>Specialization:</label>
                    <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleSpecializationChange}
                        required
                    >
                        <option value="">Select specialization</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                        <option value="other">Other (enter manually)</option>
                    </select>
                    {formData.specialization === 'other' && (
                        <input
                            type="text"
                            value={manualSpecialization}
                            onChange={handleManualSpecializationChange}
                            placeholder="Enter specialization (3-4 alphabets)"
                            required
                        />
                    )}
                </div>
                <div>
                    <label>Fees:</label>
                    <input
                        type="number"
                        name="fees"
                        value={formData.fees}
                        onChange={handleChange}
                        placeholder="500 - 5000"
                        required
                    />
                </div>
                <div>
                    <label>Contact:</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="11 digits"
                        required
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        required
                    />
                </div>
                <button type="submit">Add Doctor</button>
            </form>
        </div>
    );
};

export default AddDoctor;
