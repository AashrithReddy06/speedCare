import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Reg from './Reg';
import PedestrianDashboard from './components/PedestrianDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import InjuredDashboard from './components/InjuredDashboard';
import AdminDashboard from './components/AdminDashboard';
import Layout from './components/Layout';

function App() {
  // A simple guard to check if user is logged in
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      return <Navigate to="/login" />;
    }
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }
    return <Layout>{children}</Layout>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reg" element={<Reg />} />
        
        {/* Dashboards specifically guarded by roles */}
        <Route path="/pedestrian" element={
          <ProtectedRoute allowedRoles={['pedestrian', 'admin']}>
            <PedestrianDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/injured" element={
          <ProtectedRoute allowedRoles={['injured', 'admin']}>
            <InjuredDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/unauthorized" element={
          <Layout>
            <div className="card text-center mt-4">
              <h2 className="alert-danger p-3 rounded">Access Denied</h2>
              <p>You do not have permission to view this page.</p>
            </div>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;