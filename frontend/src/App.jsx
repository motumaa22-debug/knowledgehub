import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import BrowseLibrary from './pages/BrowseLibrary';
import ContentDetails from './pages/ContentDetails';
import TranslateStudio from './pages/TranslateStudio';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyAccount from './pages/VerifyAccount';
import ForgotPassword from './pages/ForgotPassword';
import SubmitContent from './pages/SubmitContent';
import MySubmissions from './pages/MySubmissions';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

/**
 * KnowledgeHub Main Application Root
 * Features multilingual context, 4-digit OTP account verification, and routing.
 */
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Navbar />
        <div className="main-content">
          <Routes>
            {/* Public Discovery Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseLibrary />} />
            <Route path="/translate" element={<TranslateStudio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Member Protected Routes — Access Item Details & Downloads */}
            <Route
              path="/content/:id"
              element={
                <ProtectedRoute>
                  <ContentDetails />
                </ProtectedRoute>
              }
            />

            {/* Contributor Protected Routes */}
            <Route
              path="/submit"
              element={
                <ProtectedRoute>
                  <SubmitContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-submissions"
              element={
                <ProtectedRoute>
                  <MySubmissions />
                </ProtectedRoute>
              }
            />

            {/* Administrator Protected Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="container page-container">
                  <div className="placeholder-box">
                    <h2>404 — Page Not Found</h2>
                    <p>The requested page could not be found in KnowledgeHub.</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </LanguageProvider>
  );
}
