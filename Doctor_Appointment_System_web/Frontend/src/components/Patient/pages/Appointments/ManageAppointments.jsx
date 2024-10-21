import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomModal from './CustomModel'; 
import './ManageAppointments.css';

const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: '',
    age: '',
    gender: '',
    doctorName: '',
    specialization: '',
    timeSlot: '',
    appointmentDate: ''
  });

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/appointments');
        const userAppointments = response.data.filter(
          appointment => appointment.email === userEmail
        );
        setAppointments(userAppointments);
        setFilteredAppointments(userAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error.message);
      }
    };
    fetchAppointments();
  }, [userEmail]);

  useEffect(() => {
    setFilteredAppointments(
      appointments.filter(appointment =>
        appointment.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, appointments]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z ]/g, '');
    setSearch(filteredValue);
  };

  const handleUpdate = (appointment) => {
    setSelectedAppointment(appointment);
    setUpdateForm({
      name: appointment.name,
      age: appointment.age || '',
      gender: appointment.gender || '',
      doctorName: appointment.doctorName || '',
      specialization: appointment.specialization || '',
      timeSlot: appointment.timeSlot || '',
      appointmentDate: appointment.appointmentDate || ''
    });
    setIsUpdateModalOpen(true);
  };

  const handleDeleteConfirmation = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;

    try {
      await axios.delete(`http://localhost:5000/api/user/appointments/delete/${selectedAppointment}`);
      setAppointments(appointments.filter(appointment => appointment._id !== selectedAppointment));
      setFilteredAppointments(filteredAppointments.filter(appointment => appointment._id !== selectedAppointment));
      setIsDeleteModalOpen(false);
      alert('Your Appointment was Deleted.');
    } catch (error) {
      console.error('Error deleting appointment:', error.message);
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateForm({
      ...updateForm,
      [e.target.name]: e.target.value
    });
  };

  const submitUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/user/appointments/update/${selectedAppointment._id}`, updateForm);
      setAppointments(appointments.map(appointment =>
        appointment._id === selectedAppointment._id ? { ...appointment, ...updateForm } : appointment
      ));
      setFilteredAppointments(filteredAppointments.map(appointment =>
        appointment._id === selectedAppointment._id ? { ...appointment, ...updateForm } : appointment
      ));
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating appointment:', error.message);
    }
  };

  return (
    <div className="appointments-container">
      <h1>Manage Appointments</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={handleSearchChange}
        className="search-input"
      />
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(appointment => (
              <tr key={appointment._id}>
                <td>{appointment.name}</td>
                <td>{appointment.email}</td>
                <td>{appointment.specialization}</td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.appointmentDate}</td>
                <td>{appointment.timeSlot}</td>
                <td>{appointment.gender}</td>
                <td>
                  <button onClick={() => handleUpdate(appointment)} className="btn-update">Update</button>
                  <button onClick={() => handleDeleteConfirmation(appointment._id)} className="btn-delete">Delete</button>
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

      <CustomModal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        title="Update Appointment"
      >
        <form onSubmit={(e) => { e.preventDefault(); submitUpdate(); }}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={updateForm.name}
              onChange={handleUpdateChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="text"
              name="age"
              value={updateForm.age}
              onChange={handleUpdateChange}
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <input
              type="text"
              name="gender"
              value={updateForm.gender}
              onChange={handleUpdateChange}
            />
          </div>
          <button type="submit" className="btn-update">Save Changes</button>
          <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="btn-cancel">Cancel</button>
        </form>
      </CustomModal>

      <CustomModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <button onClick={handleDelete} className="btn-delete">Yes, Delete</button>
        <button onClick={() => setIsDeleteModalOpen(false)} className="btn-cancel">Cancel</button>
      </CustomModal>
    </div>
  );
};

export default ViewAppointment;
