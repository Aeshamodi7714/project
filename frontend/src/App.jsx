import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import MyCourses from './pages/MyCourses';
import Network from './pages/Network';
import Quizzes from './pages/Quizzes';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Books from './pages/Books';
import './App.css';

import Footer from './components/Footer';

function App() {
    const [theme, setTheme] = useState('dark');
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        window.location.href = '/';
    };

    // Protected Route Component
    const ProtectedRoute = ({ children, allowedRole }) => {
        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;

        if (!token) return <Navigate to="/login" replace />;
        if (allowedRole && user?.role !== allowedRole) {
            return <Navigate to={user?.role === 'admin' ? '/admin' : '/student'} replace />;
        }
        return children;
    };

    return (
        <Router>
            <div className="app-container">
                <Header theme={theme} toggleTheme={toggleTheme} onLogout={logout} isAuthenticated={!!token} />
                <main className="main-content">
                    <div className="content-inner">
                        <Routes>
                            <Route path="/" element={<Home key="root-home" />} />
                            <Route path="/login" element={
                                token ? (
                                    <Navigate to={JSON.parse(localStorage.getItem('user'))?.role === 'admin' ? '/admin' : '/student'} replace />
                                ) : <Login setToken={setToken} />
                            } />
                            <Route path="/register" element={<Register />} />

                            {/* Student Protected Routes */}
                            <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
                            <Route path="/courses" element={<ProtectedRoute allowedRole="student"><MyCourses /></ProtectedRoute>} />
                            <Route path="/books" element={<ProtectedRoute allowedRole="student"><Books /></ProtectedRoute>} />
                            <Route path="/network" element={<ProtectedRoute allowedRole="student"><Network /></ProtectedRoute>} />
                            <Route path="/quizzes" element={<ProtectedRoute allowedRole="student"><Quizzes /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute allowedRole="student"><Profile /></ProtectedRoute>} />

                            {/* Admin Protected Routes */}
                            <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminPanel /></ProtectedRoute>} />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
