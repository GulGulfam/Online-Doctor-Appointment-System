import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './DashBoard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleAdminLogout = () => {
        navigate('/');
    };

    return (
        <div className="admin-dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-logo">Admin Dashboard</div>
                <nav className="sidebar-nav">
                    <Link to="dashboard">Dashboard</Link>
                    <Link to="add_doctor">Add Doctor</Link>
                    <Link to="view_doctors">View Doctors</Link>
                    <Link to="add_clinic">Manage Clinic</Link>
                    <Link to="appointment">View Appointments</Link>
                    <Link to="/" onClick={handleAdminLogout}>Logout</Link>
                </nav>
            </aside>
            <div className="main-content">
                <header className="header">
                    <div className="header-info">
                        <span>Welcome! Admin</span>
                    </div>
                    <button className="logout-btn" onClick={handleAdminLogout}>Logout</button>
                </header>
                
                <Outlet />

                
            </div>
        </div>
    );
};

export default AdminDashboard;
