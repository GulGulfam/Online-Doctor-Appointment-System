import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ManageAppointments.css';

Modal.setAppElement('#root');

const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
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
        const userAppointments = response.data;
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

  const handleDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/user/appointments/delete/${selectedAppointment._id}`);
      setAppointments(appointments.filter(appointment => appointment._id !== selectedAppointment._id));
      setFilteredAppointments(filteredAppointments.filter(appointment => appointment._id !== selectedAppointment._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting appointment:', error.message);
    }
  };

  const cancelDelete = () => {
    setSelectedAppointment(null);
    setIsDeleteModalOpen(false);
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
        onChange={(e) => setSearch(e.target.value)}
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
                  
                  <button onClick={() => handleDelete(appointment)} className="btn-delete">Delete</button>
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

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={cancelDelete}
        contentLabel="Confirm Delete"
      >
        <h2>Are you sure you want to delete this appointment?</h2>
        <button onClick={confirmDelete} className="btn-confirm">Yes</button>
        <button onClick={cancelDelete} className="btn-cancel">No</button>
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        contentLabel="Update Appointment"
      >
        <h2>Update Appointment</h2>
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
      </Modal>
    </div>
  );
};

export default ViewAppointment;
