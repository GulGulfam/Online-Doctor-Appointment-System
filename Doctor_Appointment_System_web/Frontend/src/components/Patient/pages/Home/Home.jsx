import React, { useState } from 'react';
import './Home.css';
import logo from '../../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../../components/Patient/pages/CustomModal/CustomModal';
import Login from '../Authentication/Login';
import Register from '../Authentication/Register';
import ClinicInformation from '../Additional/onlyClinicInformation';
import DoctorsList from '../Additional/DoctorList'; 
import ManageProfile from '../Profile/ManageProfile';
import BookAppointment from '../Appointments/BookAppointment'
import MyBookAppointment from '../Appointments/ManageAppointments'
const Home = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home'); 
  


  const handleAdminLogin = () => {
    navigate('/admin_login');
  };
  const handleDoctorLogin = () => {
    navigate('/doctor_login');
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleLoginClick = () => {
    setIsSignUp(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    handleModalClose(); 
  };

  const handleLogout = () => {
  
    navigate('/');
    setIsLoggedIn(false);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Doctor Appointment System Logo" className="logo-img" />
        </div>
        <div className="logo">Doctor Appointment System</div>
        <nav className="nav">
          <a href="#" onClick={() => handleNavigation('home')}>Home</a>
          <a href="#" onClick={() => handleNavigation('clinic')}>Clinic Information</a>
          {isLoggedIn && (
            <>
              <a href="#" onClick={() => handleNavigation('myBooking')}>My Booking</a>
              <a href="#" onClick={() => handleNavigation('bookAppointment')}>Book Appointments</a>
              <a href="#" onClick={() => handleNavigation('profile')}>Profile</a>
              
            </>
          )}
        </nav>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={handleModalOpen}>Login/SignUp</button>
              <button className="doctor-btn" onClick={handleAdminLogin}>Admin Login</button>
              <button className="doctor-btn" onClick={handleDoctorLogin}>Doctor Login</button>

            </>
          )}
        </div>
      </header>
      <div className="first-page-container">
        {currentView === 'home' && (
          <>
            <div className="hero-section">
              <h1>Find and View the Best Doctors Profile</h1>
              
            </div>
            
                <title>Doctors</title>
                <DoctorsList/>
              
          </>
        )}
        {currentView === 'doctors' && (
          <DoctorsList /> 
        )}
        {currentView === 'clinic' && (
          <ClinicInformation /> 
        )}
        {currentView === 'profile' && (
          <ManageProfile/> 
        )}
         {currentView === 'myBooking' && (
          <MyBookAppointment /> 
        )}
        {currentView === 'bookAppointment' && (
          <BookAppointment /> 
        )}
       
  
  
        
      </div>

      <CustomModal isOpen={modalOpen} onClose={handleModalClose}>
        {isSignUp ? (
          <Register onSwitchToLogin={handleLoginClick} />
        ) : (
          <Login onSwitchToRegister={handleSignUpClick} onLoginSuccess={handleLoginSuccess} />
        )}
      </CustomModal>
    </>
  );
};

export default Home;
