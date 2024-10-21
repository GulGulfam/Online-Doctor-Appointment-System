import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Input } from 'antd'; 
import './DoctorList.css';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Simulating a fetch operation with dummy data
        const fetchDoctors = () => {
            const dummyDoctors = [
                {
                    _id: '1',
                    name: 'Dr. Gulfam',
                    specialization: 'Cardiologist',
                    fees: '$100',
                    contact: '123-456-7890',
                    email: 'gulfam.sarwar@example.com',
                    address: '123 Heart St, Cardioville'
                },
                {
                    _id: '2',
                    name: 'Dr. Ali',
                    specialization: 'Dermatologist',
                    fees: '$80',
                    contact: '987-654-3210',
                    email: 'ali.khurshid@example.com',
                    address: '456 Skin Ave, Dermacity'
                },
                {
                    _id: '3',
                    name: 'Dr. Hassan',
                    specialization: 'Neurologist',
                    fees: '$120',
                    contact: '555-555-5555',
                    email: 'Hassan.ikram@example.com',
                    address: '789 Brain Blvd, Neurotown'
                }
            ];
            setDoctors(dummyDoctors);
            setFilteredDoctors(dummyDoctors);
        };

        fetchDoctors();
    }, []);

    useEffect(() => {
        const filtered = doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDoctors(filtered);
    }, [searchQuery, doctors]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        const filteredValue = value.replace(/[^a-zA-Z ]/g, '');
        setSearchQuery(filteredValue);
    };

    const handleViewClick = (doctor) => {
        setCurrentDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleBookClick = (doctor) => {
        console.log('Booking for doctor:', doctor);
    };

    return (
        <div className="view-doctor-container">
            {error && <p className="error-message">{error}</p>}
            
            <Input
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', width: '300px' }}
            />

            <table className="doctor-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Fees</th>
                        <th>Contact</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <tr key={doctor._id}>
                                <td>{doctor.name}</td>
                                <td>{doctor.specialization}</td>
                                <td>{doctor.fees}</td>
                                <td>{doctor.contact}</td>
                                <td>
                                    <Button onClick={() => handleViewClick(doctor)}>View</Button>
                                    {isLoggedIn && (
                                        <Button onClick={() => handleBookClick(doctor)} type="primary">Appointment</Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No doctors found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Modal
                title="Doctor Details"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800} 
            >
                {currentDoctor && (
                    <table className="modal-table">
                        <tbody>
                            <tr>
                                <td><strong>Name:</strong></td>
                                <td>{currentDoctor.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{currentDoctor.email}</td>
                            </tr>
                            <tr>
                                <td><strong>Specialization:</strong></td>
                                <td>{currentDoctor.specialization}</td>
                            </tr>
                            <tr>
                                <td><strong>Fees:</strong></td>
                                <td>{currentDoctor.fees}</td>
                            </tr>
                            <tr>
                                <td><strong>Contact:</strong></td>
                                <td>{currentDoctor.contact}</td>
                            </tr>
                            <tr>
                                <td><strong>Address:</strong></td>
                                <td>{currentDoctor.address}</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </Modal>
        </div>
    );
};

export default DoctorList;
