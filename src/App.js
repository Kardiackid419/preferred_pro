import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Schedule from './pages/Schedule';
import EditJob from './pages/EditJob';
import CreateJob from './pages/CreateJob';
import Employees from './pages/Employees';
import ForemanTools from './pages/ForemanTools';
import { ProtectedRoute } from './components/ProtectedRoute';
import AllJobs from './pages/AllJobs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route 
          path="/jobs/create" 
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateJob />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/job/:jobId" 
          element={
            <ProtectedRoute requiredRole="admin">
              <EditJob />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employees" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Employees />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/foreman" 
          element={
            <ProtectedRoute requiredRole="foreman">
              <ForemanTools />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/schedule" 
          element={
            <ProtectedRoute requiredRole="crew">
              <Schedule />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/all-jobs" 
          element={
            <ProtectedRoute requiredRole="crew">
              <AllJobs />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;