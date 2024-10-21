import React, { useState } from 'react';
import axios from 'axios';
import './AddReport.css';

const AddReport = () => {
    const [formData, setFormData] = useState({
        name: '',
        disease: '',
        level: '',
        symptomsDate: '',
    });
    const [error, setError] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        // Validation
        if (!formData.name || !formData.disease || !formData.level || !formData.symptomsDate) {
            setError('All fields are required.');
            return;
        }
    
        try {
            // Send POST request to the API
            await axios.post('http://localhost:5000/api/reports', formData);
            alert('Report added successfully.');
            setFormData({
                name: '',
                disease: '',
                level: '',
                symptomsDate: '',
            });
        } catch (err) {
            // Detailed error logging
            if (err.response) {
                // Server responded with a status other than 2xx
                console.error('Error response:', err.response);
                setError(`Error: ${err.response.status} - ${err.response.statusText}. ${err.response.data.message || ''}`);
            } else if (err.request) {
                // Request was made but no response received
                console.error('Error request:', err.request);
                setError('Error: No response from the server.');
            } else {
                // Something else caused the error
                console.error('Error message:', err.message);
                setError('Error adding report: ' + err.message);
            }
        }
    };
    

    return (
        <div className="add-report-container">
            <h1>Add Report</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                    />
                </div>
                <div>
                    <label>Disease:</label>
                    <input
                        type="text"
                        name="disease"
                        value={formData.disease}
                        onChange={handleChange}
                        placeholder="Enter disease"
                        required
                    />
                </div>
                <div>
                    <label>Level:</label>
                    <input
                        type="text"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        placeholder="Enter level"
                        required
                    />
                </div>
                <div>
                    <label>Symptoms Date:</label>
                    <input
                        type="date"
                        name="symptomsDate"
                        value={formData.symptomsDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Add Report</button>
            </form>
        </div>
    );
};

export default AddReport;
