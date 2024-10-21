

import AdminDashboard from './components/Admin/Home/Dashboard'; 
import AddDoctor from './components/Admin/Doctor/AddDoctor';
import ViewDoctors from './components/Admin/Doctor/ViewDoctor';
import AddClinic from './components/Admin/Clinic_Information/AddClinic'; 
import DoctorsList from './components/Patient/pages/Additional/DoctorList';
import Appointments from './components/Admin/Additional/Appointmetments'

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Patient/pages/Home/Home';
import Login_admin from './components/Admin/Authentication/Login';
import Login_doctor from './components/Doctor/Authentication/Login';


import Dashboardb from './components/Admin/Home/Dashboardb';
import DoctorDashboard from './components/Doctor/Home/DoctorDashboard';
import AddReport from './components/Doctor/Report/AddReport';
import ViewReport from './components/Doctor/Report/ViewReport';
import ManageProfile from './components/Doctor/Profile/ManageProfile'
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/admin_login" element={<Login_admin />} />
            <Route path="/doctor_login" element={<Login_doctor />} />

            <Route path="/admin_dashboard" element={<AdminDashboard />}>
                <Route path="add_doctor" element={<AddDoctor />} />
                <Route path="dashboard" element={<Dashboardb />} />
                <Route path="view_doctors" element={<ViewDoctors />} />
                <Route path="add_clinic" element={<AddClinic />} />
                <Route path="appointments" element={<Appointments />} />
            </Route>

            <Route path="/doctor_dashboard" element={<DoctorDashboard />}>
                <Route path="add_report" element={<AddReport />} />
                <Route path="view_report" element={<ViewReport />} />
                <Route path="profile" element={<ManageProfile />} />

            </Route>
        </Routes>
    );
};

export default App;
