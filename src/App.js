import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
    const { token } = useContext(AuthContext);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Redirect home to login or dashboard based on auth */}
                    <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                    
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected Route */}
                    <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;