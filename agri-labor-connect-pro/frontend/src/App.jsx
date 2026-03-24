import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import JobSearch from './pages/JobSearch';
import Chat from './pages/Chat';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/chat/:userId" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
