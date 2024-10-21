import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Modal from 'react-modal';
import './BookAppointment.css';

Modal.setAppElement('#root');

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [modalStates, setModalStates] = useState({
    specialization: false,
    doctor: false,
    timeSlot: false,
    success: false,
    error: false,
    accountType: false,
    gender: false
  });
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [contact, setContact] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/doctor/viewall');
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        setSpecializations([...new Set(response.data.map(doctor => doctor.specialization))]);
      } catch (err) {
        setError('Error fetching doctors.');
        setModalStates(prev => ({ ...prev, error: true }));
      }
    };

    fetchDoctors();
    generateTimeSlots();
  }, []);

  useEffect(() => {
    const fetchBookedTimeSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/appointments?date=${appointmentDate.toISOString().split('T')[0]}`);
        const bookedSlots = response.data.map(appointment => appointment.timeSlot);
        const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));
        setAvailableTimeSlots(availableSlots);
      } catch (err) {
        console.error('Error fetching booked time slots:', err);
      }
    };

    fetchBookedTimeSlots();
  }, [appointmentDate, timeSlots]);

  const generateTimeSlots = () => {
    const slots = [];
    let startTime = new Date();
    startTime.setHours(8, 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(12, 0, 0, 0);

    while (startTime < endTime) {
      const nextTime = new Date(startTime.getTime() + 15 * 60000);
      slots.push(`${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      startTime = nextTime;
    }

    setTimeSlots(slots);
    setAvailableTimeSlots(slots);
  };

  const handleSpecializationChange = (specialization) => {
    setSelectedSpecialization(specialization);
    setFilteredDoctors(doctors.filter(doctor => doctor.specialization === specialization));
    setSelectedDoctor('');
    closeModal('specialization');
  };

  const handleDoctorChange = (doctor) => {
    setSelectedDoctor(doctor);
    closeModal('doctor');
  };

  const handleDateChange = (date) => {
    setAppointmentDate(date);
  };

  const handleTimeSlotChange = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    closeModal('timeSlot');
  };

  const handleAccountTypeChange = (type) => {
    setSelectedAccountType(type);
    closeModal('accountType');
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    closeModal('gender');
  };

  const validateName = (value) => value.replace(/[^a-zA-Z ]/g, '');

  const handleNameChange = (e) => setName(validateName(e.target.value));
  const handleFullNameChange = (e) => setFullName(validateName(e.target.value));
  const handleAccountNameChange = (e) => setAccountName(validateName(e.target.value));
  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (value >= 5 && value <= 80) setAge(value);
  };
  const handleContactChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 11) setContact(value);
  };
  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 11) setAccountNumber(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !appointmentDate || !selectedTimeSlot || !selectedAccountType || !selectedGender ||
        !name || !fullName || !age || !contact || !accountName || !accountNumber) {
      setMessage('Please fill out all fields.');
      setModalStates(prev => ({ ...prev, error: true }));
      return;
    }

    if (contact.length !== 11) {
      setMessage('Contact number must be 11 digits long.');
      setModalStates(prev => ({ ...prev, error: true }));
      return;
    }

    if (age < 5 || age > 80) {
      setMessage('Age must be between 5 and 80.');
      setModalStates(prev => ({ ...prev, error: true }));
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    const appointment = {
      name,
      email: userEmail,
      age,
      gender: selectedGender,
      contact,
      specialization: selectedSpecialization,
      doctorName: selectedDoctor,
      appointmentDate: appointmentDate.toISOString(),
      timeSlot: selectedTimeSlot,
      accountType: selectedAccountType,
      accountName,
      accountNumber,
    };

    try {
      const response = await fetch('http://localhost:5000/api/user/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (response.ok) {
        setMessage('Appointment booked successfully.');
        setModalStates(prev => ({ ...prev, success: true }));
        // Reset form fields
        setName('');
        setAge('');
        setContact('');
        setAccountName('');
        setAccountNumber('');
        setFullName('');
        setSelectedDoctor('');
        setSelectedGender('');
        setSelectedAccountType('');
        setSelectedSpecialization('');
        setSelectedTimeSlot('');
        setAppointmentDate(new Date());
      } else {
        setMessage('Error booking appointment.');
        setModalStates(prev => ({ ...prev, error: true }));
      }
    } catch (err) {
      setMessage('Error booking appointment.');
      setModalStates(prev => ({ ...prev, error: true }));
    }
  };

  const openModal = (modalName) => {
    setModalStates(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalStates(prev => ({ ...prev, [modalName]: false }));
  };

  return (
    <div className="book-appointment">
      <form onSubmit={handleSubmit}>
        <h2>Booking Form</h2>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={handleNameChange} />
        </div>
        <div>
          <label>Full Name:</label>
          <input type="text" value={fullName} onChange={handleFullNameChange} />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" value={age} onChange={handleAgeChange} />
        </div>
        <div>
          <label>Contact Number:</label>
          <input type="text" value={contact} onChange={handleContactChange} />
        </div>
        <div>
          <label>Specialization:</label>
          <button type="button" onClick={() => openModal('specialization')}>{selectedSpecialization || 'Select Specialization'}</button>
        </div>
        <div>
          <label>Doctor:</label>
          <button type="button" onClick={() => openModal('doctor')}>{selectedDoctor || 'Select Doctor'}</button>
        </div>
        <div>
          <label>Appointment Date:</label>
          <DatePicker
            selected={appointmentDate}
            onChange={handleDateChange}
            minDate={new Date()}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 1))}
          />
        </div>
        <div>
          <label>Time Slot:</label>
          <button type="button" onClick={() => openModal('timeSlot')}>{selectedTimeSlot || 'Select Time Slot'}</button>
        </div>
        <div>
          <label>Account Type:</label>
          <button type="button" onClick={() => openModal('accountType')}>{selectedAccountType || 'Select Account Type'}</button>
        </div>
        <div>
          <label>Gender:</label>
          <button type="button" onClick={() => openModal('gender')}>{selectedGender || 'Select Gender'}</button>
        </div>
        <div>
          <label>Account Name:</label>
          <input type="text" value={accountName} onChange={handleAccountNameChange} />
        </div>
        <div>
          <label>Account Number:</label>
          <input type="text" value={accountNumber} onChange={handleAccountNumberChange} />
        </div>
        <button type="submit">Submit</button>
      </form>

      <Modal isOpen={modalStates.specialization} onRequestClose={() => closeModal('specialization')}>
        <h2>Select Specialization</h2>
        {specializations.map(spec => (
          <button key={spec} onClick={() => handleSpecializationChange(spec)}>{spec}</button>
        ))}
        <button onClick={() => closeModal('specialization')}>Close</button>
      </Modal>

      <Modal isOpen={modalStates.doctor} onRequestClose={() => closeModal('doctor')}>
        <h2>Select Doctor</h2>
        {filteredDoctors.map(doctor => (
          <button key={doctor._id} onClick={() => handleDoctorChange(doctor.name)}>{doctor.name}</button>
        ))}
        <button onClick={() => closeModal('doctor')}>Close</button>
      </Modal>

      <Modal isOpen={modalStates.timeSlot} onRequestClose={() => closeModal('timeSlot')}>
        <h2>Select Time Slot</h2>
        {availableTimeSlots.map(slot => (
          <button key={slot} onClick={() => handleTimeSlotChange(slot)}>{slot}</button>
        ))}
        <button onClick={() => closeModal('timeSlot')}>Close</button>
      </Modal>
      <Modal isOpen={modalStates.accountType} onRequestClose={() => closeModal('accountType')}>
        <h2>Select Account Type</h2>
        <button onClick={() => handleAccountTypeChange('Easypaisa')}>Easypaisa</button>
        <button onClick={() => handleAccountTypeChange('Jazzcash')}>Jazzcash</button>
        <button onClick={() => closeModal('accountType')}>Close</button>
      </Modal>
      <Modal isOpen={modalStates.gender} onRequestClose={() => closeModal('gender')}>
        <h2>Select Gender</h2>
        <button onClick={() => handleGenderChange('Male')}>Male</button>
        <button onClick={() => handleGenderChange('Female')}>Female</button>
        <button onClick={() => closeModal('gender')}>Close</button>
      </Modal>

      <Modal isOpen={modalStates.success} onRequestClose={() => closeModal('success')}>
        <h2>Success</h2>
        <p>{message}</p>
        <button onClick={() => closeModal('success')}>Close</button>
      </Modal>

      <Modal isOpen={modalStates.error} onRequestClose={() => closeModal('error')}>
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={() => closeModal('error')}>Close</button>
      </Modal>
    </div>
  );
};

export default BookAppointment;
