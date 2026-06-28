import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import TechnicalEvents from './pages/TechnicalEvents';
import NonTechnicalEvents from './pages/NonTechnicalEvents';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Student Pages
import MyRegistrations from './pages/MyRegistrations';
import MyCertificates from './pages/MyCertificates';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageStudents from './pages/admin/ManageStudents';
import GenerateCertificates from './pages/admin/GenerateCertificates';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Layout containing Header/Footer */}
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="events/technical" element={<TechnicalEvents />} />
            <Route path="events/non-technical" element={<NonTechnicalEvents />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />

            {/* Student Protected routes */}
            <Route
              path="student/registrations"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyRegistrations />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/certificates"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyCertificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/profile"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/events"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/students"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/certificates"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <GenerateCertificates />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
