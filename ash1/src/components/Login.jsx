import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "https://backend-m450.onrender.com";

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const user = response.data;
      
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.username);
      localStorage.setItem('userRole', user.role);

      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'doctor') navigate('/doctor');
      else if (user.role === 'injured') navigate('/injured');
      else navigate('/pedestrian');

    } catch (err) {
      setError(err.response?.data || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome to SpeedCare</h2>
        <p className="text-center text-muted mb-3">Login to access your dashboard</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              name="email" 
              required
              placeholder="e.g. user@gmail.com"
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
              placeholder="••••••••"
              onChange={handleChange} 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p>Don't have an account? <Link to="/reg" className="link">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
