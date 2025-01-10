import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import UserPage from './pages/UserPage';
import MesasPage from './pages/MesasPage';
import CrearMesaPage from './pages/CrearMesaPage';
import MesaDetailPage from './pages/MesaDetailPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={ <ProtectedRoute/>}>
          <Route path="/user" element={<UserPage />} />
          <Route path="/mesas" element={<MesasPage />} />
          <Route path="/crear-mesa" element={<CrearMesaPage />} />
          <Route path="/mesa/:id" element={<MesaDetailPage />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
