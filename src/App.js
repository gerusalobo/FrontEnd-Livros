// src/App.js
import React from 'react';
import './App.css';
import Home from './components/Home/Home'; // Atualizado para Home
import Books from './components/Books/Books';
import Header from './components/Header/Header';
import AuthProvider from './context/AuthProvider';
import AuthContext from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Home />} /> {/* Página de Login */}
          <Route
            path="/Books"
            element={
              <PrivateRoute>
                <Header />
                <Books />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Adicione outras rotas protegidas aqui */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  return (
    <AuthContext.Consumer>
      {({ isAuthenticated }) =>
        isAuthenticated ? children : <Navigate to="/login" replace />
      }
    </AuthContext.Consumer>
  );
};

export default App;
