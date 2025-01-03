import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('Admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        navigate('/admin-dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <h1>KLE Technological University</h1>
        <p>Welcome to the Faculty and Admin portal of KLE Tech. Use your credentials to log in and manage classroom and lab allocations.</p>
        <ul>
          <li>View COE Calendar</li>
          <li>Contact Support</li>
        </ul>
      </div>
      <div className="right-panel">
        <div className="login-box">
          <h2>Login to Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Role:</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="form-control"
              >
                <option value="Admin">Admin</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="login-button">LOGIN</button>
            
            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
