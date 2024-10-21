import React, { useState } from 'react';
import './Login.css';

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Result:', result); 
        if (result.token) {
   
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userName', result.name || ''); 
          console.log('Stored Name:', localStorage.getItem('userName'));
          onLoginSuccess();
        } else {
          setError('Token not received');
        }
      } else {
        const result = await response.json();
        alert(result.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Don't have an account? <a href="#" onClick={onSwitchToRegister}>Create one</a></p>
    </div>
  );
};

export default Login;
