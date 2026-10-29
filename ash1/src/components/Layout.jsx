import React from 'react';
import { useNavigate } from 'react-router-dom';

function Layout({ children }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('userName') || 'User';
  const role = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          🚑 SpeedCare
        </div>
        <div className="navbar-nav">
            {role && <span className="badge">Role: {role}</span>}
            <span>Welcome, {username}</span>
            <button className="btn btn-outline" style={{padding: '0.4rem 1rem'}} onClick={handleLogout}>
              Logout
            </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
