import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Dynamic navigation based on role
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/student');
                }
                window.location.reload();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Connection refused. Is the backend running?');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass animate-slide-up">
                <div className="auth-header">
                    <BrainCircuit size={48} className="auth-logo pulse" />
                    <h1>Welcome Back</h1>
                    <p>Access your intelligent learning ecosystem</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    {error && <div className="error-msg">{error}</div>}

                    <div className="input-group">
                        <Mail size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        Login Now <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>Register here</Link></p>
                </div>
            </div>

            <style jsx>{`
        h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
        .auth-logo { margin-bottom: 1.5rem; filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.4)); }
        .auth-footer { border-top: 1px solid var(--border); padding-top: 1.5rem; margin-top: 1.5rem; }
        .error-msg { background: rgba(244, 63, 94, 0.1); border: 1px solid var(--accent); color: var(--accent); padding: 0.75rem; border-radius: 12px; font-size: 0.85rem; margin-bottom: 0.5rem; }
        .input-group:focus-within { border-color: var(--primary); box-shadow: 0 0 15px rgba(99, 102, 241, 0.1); }
      `}</style>
        </div>
    );
};

export default Login;
