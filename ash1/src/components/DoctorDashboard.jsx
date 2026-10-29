import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "https://backend-m450.onrender.com";

function DoctorDashboard() {
  const [formData, setFormData] = useState({
    situation: '',
    medicationDetails: ''
  });
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      await axios.post(`${API_URL}/api/medications?userId=${userId}`, formData);
      setSuccess("Medication posted successfully! It will now be visible to pedestrians.");
      setFormData({ situation: '', medicationDetails: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert("Error posting medication. Only doctors are allowed.");
    }
  };

  return (
    <div>
      <div className="welcome-header">
        <h1>Doctor Dashboard ⚕️</h1>
        <p>Post critical first-aid and medication routines for emergencies.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3>Add an Emergency Medication / Protocol</h3>
        
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="form-group">
            <label>Describe the Situation</label>
            <input 
              type="text" 
              className="form-control" 
              name="situation" 
              placeholder="e.g. Heart Attack, Dehydration, Heat Stroke"
              value={formData.situation}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Medication / Action Needed immediately</label>
            <textarea 
              className="form-control" 
              name="medicationDetails" 
              rows="5"
              placeholder="e.g. Have the patient chew and swallow an aspirin, perform CPR if unconscious..."
              value={formData.medicationDetails}
              onChange={handleChange}
              required 
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3">Post to Local Database</button>
        </form>
      </div>
    </div>
  );
}

export default DoctorDashboard;
