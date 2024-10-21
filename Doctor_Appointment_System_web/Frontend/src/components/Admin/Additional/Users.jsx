import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Input } from 'antd'; 
import './DoctorList.css'
const ViewDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/');
                setDoctors(response.data);
                setFilteredDoctors(response.data);
            } catch (err) {
                setError('Error fetching doctors.');
                console.error(err);
            }
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
        setSearchQuery(e.target.value);
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
            <h1>Doctors List</h1>
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
                                        <Button onClick={() => handleBookClick(doctor)} type="primary">Book</Button>
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

export default ViewDoctor;
