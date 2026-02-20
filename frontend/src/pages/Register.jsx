import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                // Redirect based on role
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
            setError('Registration failed. Check backend connection.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass animate-slide-up">
                <div className="auth-header">
                    <BrainCircuit size={48} className="auth-logo pulse" />
                    <h1>Create Account</h1>
                    <p>Join the Autonomous Learning Ecosystem</p>
                </div>

                <form onSubmit={handleRegister} className="auth-form">
                    {error && <div className="error-msg">{error}</div>}

                    <div className="input-group">
                        <User size={18} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Mail size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={18} />
                        <input
                            type="password"
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="role-selection">
                        <p className="role-label">Choose your access level:</p>
                        <div className="radio-group">
                            <label className={`radio-pill ${formData.role === 'student' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={formData.role === 'student'}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                                <User size={16} />
                                <span>Student</span>
                            </label>

                            <label className={`radio-pill ${formData.role === 'admin' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={formData.role === 'admin'}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                                <ShieldCheck size={16} />
                                <span>Admin</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="auth-btn">
                        Get Started <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>

            <style jsx>{`
        .role-selection {
          text-align: left;
          margin-top: 0.5rem;
        }
        .role-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }
        .radio-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .radio-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
        }
        .radio-pill input {
          display: none;
        }
        .radio-pill:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--primary);
        }
        .radio-pill.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
      `}</style>
        </div>
    );
};

export default Register;
