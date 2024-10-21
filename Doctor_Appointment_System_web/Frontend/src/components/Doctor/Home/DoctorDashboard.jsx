// import React from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import './DashBoard.css';

// const DoctorDashboard = () => {
//     const navigate = useNavigate();

//     const handleDoctorLogout = () => {
//         navigate('/');
//     };

//     return (
//         <div className="admin-dashboard-container">
//             <aside className="sidebar">
//                 <div className="sidebar-logo">Doctor Dashboard</div>
//                 <nav className="sidebar-nav">
//                     {/* <Link to="dashboard_db">Dashboard</Link> */}
//                     <Link to="add_report">Add Report</Link>
//                     <Link to="view_report">View Report</Link>
//                     {/* <Link to="view_doctors">Search Medicine</Link> */}
//                     <Link to="/" onClick={handleAdminLogout}>Logout</Link>
//                 </nav>
//             </aside>
//             <div className="main-content">
//                 <header className="header">
//                     <div className="header-info">
//                         <span>Welcome! Doctor</span>
//                     </div>
//                     <button className="logout-btn" onClick={handleDoctorLogout}>Logout</button>
//                 </header>
                
//                 <Outlet />

                
//             </div>
//         </div>
//     );
// };

// export default DoctorDashboard;
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './DashBoard.css';

const DoctorDashboard = () => {
    const navigate = useNavigate();

    const handleDoctorLogout = () => {
        navigate('/');
    };

    return (
        <div className="doctor-dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-logo">Doctor Dashboard</div>
                <nav className="sidebar-nav">
                    <Link to="add_report">Add Report</Link>
                    <Link to="view_report">View Report</Link>
                    <Link to="profile">Profile</Link>

                    <Link to="/" onClick={handleDoctorLogout}>Logout</Link>
                </nav>
            </aside>
            <div className="main-content">
                <header className="header">
                    <div className="header-info">
                        <span>Welcome! Doctor</span>
                    </div>
                    <button className="logout-btn" onClick={handleDoctorLogout}>Logout</button>
                </header>
                <Outlet />
            </div>
        </div>
    );
};

export default DoctorDashboard;

