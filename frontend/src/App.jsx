import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import EmailDrafts from './pages/EmailDrafts';
import SentEmails from './pages/SentEmails';
import Templates from './pages/Templates';
import Broadcast from './pages/Broadcast';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="drafts" element={<EmailDrafts />} />
          <Route path="sent" element={<SentEmails />} />
          <Route path="templates" element={<Templates />} />
          <Route path="broadcast" element={<Broadcast />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
