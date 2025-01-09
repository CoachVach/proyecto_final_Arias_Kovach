import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import UserPage from './components/UserPage';
import MesasPage from './components/MesasPage';
import CrearMesaPage from './components/CrearMesaPage';
import MesaDetailPage from './components/MesaDetailPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/mesas" element={<MesasPage />} />
        <Route path="/crear-mesa" element={<CrearMesaPage />} />
        <Route path="/mesa/:id" element={<MesaDetailPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
