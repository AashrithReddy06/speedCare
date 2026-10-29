import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [medications, setMedications] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const uRes = await axios.get('https://backend-m450.onrender.com/users');
      setUsers(uRes.data);

      const mRes = await axios.get('https://backend-m450.onrender.com/api/medications');
      setMedications(mRes.data);

      const tRes = await axios.get('https://backend-m450.onrender.com/api/treatments');
      setTreatments(tRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="welcome-header">
        <h1>Admin Control Panel ⚙️</h1>
        <p>Overview of all users, doctors' posts, and patient testimonies.</p>
      </div>

      <div className="results-grid">
        <div className="card">
          <h3>Registered Users ({users.length})</h3>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            {users.map((u) => (
              <li key={u.id}><strong>{u.username}</strong> - Role: {u.role}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Medications from Doctors ({medications.length})</h3>
          {medications.map(m => (
            <div key={m.id} style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px'}}>
              <strong>{m.situation}</strong>
              <p className="text-muted" style={{fontSize: '0.9rem'}}>{m.medicationDetails}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Treatments Shared by Injured ({treatments.length})</h3>
          {treatments.map(t => (
            <div key={t.id} style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px'}}>
              <strong>{t.situation}</strong>
              <p className="text-muted" style={{fontSize: '0.9rem'}}>{t.methodShared}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
