import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const navigate = useNavigate(); 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = formData;
        if (username === 'admin' && password === 'admin123') {
            navigate('/admin_dashboard'); 
        } else {
            alert('Invalid credentials! Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="left-section">
               
            </div>
            <div className="right-section">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>UserName</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="sign-in-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
