import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewDoctor.css';
import { Button, Modal, Form, Input } from 'antd'; 

const ViewDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [deleteDoctorId, setDeleteDoctorId] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/doctor/viewall');
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

    const handleEditClick = (doctor) => {
        setCurrentDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteDoctorId(id);
        setIsDeleteModalOpen(true);
    };

    const handleUpdate = async (values) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/doctor/update/${currentDoctor._id}`, values);
            setDoctors(doctors.map(doctor => doctor._id === currentDoctor._id ? { ...doctor, ...values } : doctor));
            setFilteredDoctors(filteredDoctors.map(doctor => doctor._id === currentDoctor._id ? { ...doctor, ...values } : doctor));
            setIsModalOpen(false);
        } catch (err) {
            setError('Error updating doctor.');
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/doctor/remove/${deleteDoctorId}`);
            setDoctors(doctors.filter(doctor => doctor._id !== deleteDoctorId));
            setFilteredDoctors(filteredDoctors.filter(doctor => doctor._id !== deleteDoctorId));
            setIsDeleteModalOpen(false);
        } catch (err) {
            setError('Error deleting doctor.');
            console.error(err);
        }
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
                        <th>Email</th>
                        <th>Specialization</th>
                        <th>Fees</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <tr key={doctor._id}>
                                <td>{doctor.name}</td>
                                <td>{doctor.email}</td>
                                <td>{doctor.specialization}</td>
                                <td>{doctor.fees}</td>
                                <td>{doctor.contact}</td>
                                <td>{doctor.address}</td>
                                <td>
                                    <Button onClick={() => handleEditClick(doctor)}>Edit</Button>
                                    <Button onClick={() => handleDeleteClick(doctor._id)} danger>Delete</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No doctors found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Modal
                title="Edit Doctor"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    initialValues={currentDoctor}
                    onFinish={handleUpdate}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the doctor\'s name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please input the doctor\'s email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="specialization"
                        label="Specialization"
                        rules={[{ required: true, message: 'Please input the doctor\'s specialization!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="fees"
                        label="Fees"
                        rules={[{ required: true, message: 'Please input the doctor\'s fees!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="contact"
                        label="Contact"
                        rules={[{ required: true, message: 'Please input the doctor\'s contact!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Please input the doctor\'s address!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Update</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirm Deletion"
                open={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                footer={[
                    <Button key="back" onClick={() => setIsDeleteModalOpen(false)}>
                        No
                    </Button>,
                    <Button key="submit" type="primary" danger onClick={handleDelete}>
                        Yes
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete this doctor?</p>
            </Modal>
        </div>
    );
};

export default ViewDoctor;
