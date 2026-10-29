import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "https://backend-m450.onrender.com";

function Reg() {
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'pedestrian' // Default role
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      setSuccess(response.data);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'An error occurred during registration.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="text-center text-muted mb-3">Join SpeedCare to assist or get assistance.</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="form-control" 
              name="username" 
              required
              placeholder="e.g. JohnDoe"
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              name="email" 
              required
              placeholder="e.g. johndoe@gmail.com"
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              name="password" 
              required
              placeholder="Create a password"
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Select Role</label>
            <select name="role" className="form-control" value={data.role} onChange={handleChange}>
              <option value="pedestrian">Pedestrian (Helping Others)</option>
              <option value="doctor">Doctor (Providing Medication Setup)</option>
              <option value="injured">Injured (Sharing Your Treatment Map)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3">
            Register Account
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p>Already have an account? <Link to="/login" className="link">Log in here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Reg;
