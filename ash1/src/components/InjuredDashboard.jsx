import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "https://backend-m450.onrender.com";

function InjuredDashboard() {
  const [formData, setFormData] = useState({
    situation: '',
    methodShared: ''
  });
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      await axios.post(`${API_URL}/api/treatments?userId=${userId}`, formData);
      setSuccess("Your treatment experience was shared successfully. Thank you!");
      setFormData({ situation: '', methodShared: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert("Error sharing treatment. Only injured users can post this.");
    }
  };

  return (
    <div>
      <div className="welcome-header">
        <h1>Injured Persons Portal 🩹</h1>
        <p>Share the methods you used or that were used on you to survive an emergency situation.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3>Share Your Treatment Journey</h3>
        
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="form-group">
            <label>What happened?</label>
            <input 
              type="text" 
              className="form-control" 
              name="situation" 
              placeholder="e.g. Cut on rusty metal, Bee sting allergy"
              value={formData.situation}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>What immediate method or action helped you survive?</label>
            <textarea 
              className="form-control" 
              name="methodShared" 
              rows="5"
              placeholder="e.g. My friend wrapped a tight cloth right above the wound to stop extreme bleeding..."
              value={formData.methodShared}
              onChange={handleChange}
              required 
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3">Share Experience</button>
        </form>
      </div>
    </div>
  );
}

export default InjuredDashboard;
