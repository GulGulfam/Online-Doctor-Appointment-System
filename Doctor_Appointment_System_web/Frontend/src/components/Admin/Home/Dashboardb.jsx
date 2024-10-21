import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashBoard.css';

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [stat, setStat] = useState('null');
    const [isHomePage, setIsHomePage] = useState(true); 

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/appointments');
                const userAppointments = response.data;
                setAppointments(userAppointments);
                setTotalAppointments(userAppointments.length);
            } catch (error) {
                console.error('Error fetching appointments:', error.message);
            }
        };
        fetchAppointments();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/doctor/viewall');
                setDoctors(response.data);
                setTotalDoctors(response.data.length);
            } catch (err) {
                console.error('Error fetching doctors:', err);
            }
        };
        fetchDoctors();
    }, []);

    const handleDelete = async (appointment) => {
        try {
            await axios.delete(`http://localhost:5000/api/user/appointments/${appointment._id}`);
            setAppointments(appointments.filter((appt) => appt._id !== appointment._id));
            setTotalAppointments(totalAppointments - 1);
        } catch (error) {
            console.error('Error deleting appointment:', error.message);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-stats">
                <div className="stat-item">
                    <button onClick={() => setStat('appointments')}>Total Appointments</button>
                    <p>{totalAppointments}</p>
                </div>
                <div className="stat-item">
                    <button onClick={() => setStat('doctors')}>Total Doctors</button>
                    <p>{totalDoctors}</p>
                </div>
            </div>

            <div className="stat-details">
                {isHomePage ? (
                    <>
                        {stat === 'null' && (
                            <p>Select an option to view details.</p>
                        )}
                        {stat === 'appointments' && (
                            <div>
                                <h2>All Appointments</h2>
                                <table className="appointments-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Specialization</th>
                                            <th>Doctor</th>
                                            <th>Appointment Date</th>
                                            <th>Time Slot</th>
                                            <th>Gender</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.length > 0 ? (
                                            appointments.map(appointment => (
                                                <tr key={appointment._id}>
                                                    <td>{appointment.name}</td>
                                                    <td>{appointment.email}</td>
                                                    <td>{appointment.specialization}</td>
                                                    <td>{appointment.doctorName}</td>
                                                    <td>{appointment.appointmentDate}</td>
                                                    <td>{appointment.timeSlot}</td>
                                                    <td>{appointment.gender}</td>
                                                    <td>
                                                        <button 
                                                            onClick={() => handleDelete(appointment)} 
                                                            className="btn-delete"
                                                        >
                                                            
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="no-appointments">No appointments found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {stat === 'doctors' && (
                            <div>
                                <h2>All Doctors</h2>
                                <table className="doctors-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Specialization</th>
                                            <th>Email</th>
                                            <th>Address</th>
                                            <th>Contact</th>
                                            <th>Fees</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doctors.length > 0 ? (
                                            doctors.map(doctor => (
                                                <tr key={doctor._id}>
                                                    <td>{doctor.name}</td>
                                                    <td>{doctor.specialization}</td>
                                                    <td>{doctor.email}</td>
                                                    <td>{doctor.address}</td>
                                                    <td>{doctor.contact}</td>
                                                    <td>{doctor.fees}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="no-doctors">No doctors found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : (
                    <p>Content is not available on this page.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
