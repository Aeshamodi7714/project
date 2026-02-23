import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Award,
    BookOpen,
    LogOut,
    ChevronRight,
    Clock,
    Star,
    CheckCircle2,
    LayoutDashboard
} from 'lucide-react';

const Profile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = () => {
        const userJson = localStorage.getItem('user');
        const userObj = userJson ? JSON.parse(userJson) : null;
        if (!userObj) {
            navigate('/login');
            return;
        }

        const API_BASE = `http://${window.location.hostname}:5000`;
        fetch(`${API_BASE}/api/student/${userObj.id}/dashboard`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    if (loading) return (
        <div className="loading-screen" style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner"></div>
        </div>
    );

    const user = data?.user || {};
    const attempts = data?.attempts || [];
    const progress = data?.progress || [];
    const totalPoints = attempts.reduce((acc, curr) => acc + (Math.round(curr.score) * 10), 0);

    return (
        <div className="profile-container animate-slide-up">
            <div className="profile-header-card glass-dark">
                <div className="profile-user-info">
                    <div className="profile-avatar">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="profile-text">
                        <h1>{user?.name}</h1>
                        <p className="role-badge">{user?.role?.toUpperCase()}</p>
                        <p className="join-date">Joined {new Date(user?.joinedAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <button className="profile-logout-btn" onClick={logout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>

            <div className="profile-stats-grid">
                <div className="stat-card glass-dark">
                    <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                        <Star size={24} color="var(--primary)" />
                    </div>
                    <div className="stat-content">
                        <span className="stat-val">{totalPoints}</span>
                        <span className="stat-lab">Total Points</span>
                    </div>
                </div>
                <div className="stat-card glass-dark">
                    <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                        <Award size={24} color="#10b981" />
                    </div>
                    <div className="stat-content">
                        <span className="stat-val">{attempts.length}</span>
                        <span className="stat-lab">Quizzes Taken</span>
                    </div>
                </div>
                <div className="stat-card glass-dark">
                    <div className="stat-icon-wrap" style={{ background: 'rgba(14, 165, 233, 0.1)' }}>
                        <BookOpen size={24} color="var(--secondary)" />
                    </div>
                    <div className="stat-content">
                        <span className="stat-val">{progress.filter(p => p.status === 'completed').length}</span>
                        <span className="stat-lab">Courses Finished</span>
                    </div>
                </div>
            </div>

            <div className="profile-main-content">
                <div className="profile-section">
                    <div className="section-title">
                        <Clock size={20} />
                        <h2>Quiz History</h2>
                    </div>
                    <div className="history-table-wrap glass-dark">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Quiz</th>
                                    <th>Score</th>
                                    <th>Points</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.length > 0 ? attempts.map((att, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className="quiz-cell">
                                                <span className="q-title">{att.quiz?.title || 'General Quiz'}</span>
                                                <span className="q-cat">{att.quiz?.relatedSkill?.name || 'General'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`score-badge ${att.score >= 70 ? 'high' : att.score >= 40 ? 'mid' : 'low'}`}>
                                                {Math.round(att.score)}%
                                            </span>
                                        </td>
                                        <td>
                                            <span className="points-val">+{Math.round(att.score) * 10}</span>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(att.attemptedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                            No quizzes attempted yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="profile-section">
                    <div className="section-title">
                        <LayoutDashboard size={20} />
                        <h2>My Courses</h2>
                    </div>
                    <div className="profile-courses-grid">
                        {progress.map((p, i) => (
                            <div key={i} className={`profile-course-card glass-dark ${p.status}`}>
                                <div className="course-icon-box">
                                    <BookOpen size={20} />
                                </div>
                                <div className="course-info">
                                    <h3>{p.skill?.name}</h3>
                                    <div className="status-pill">
                                        {p.status === 'completed' ? <CheckCircle2 size={12} /> : null}
                                        {p.status.toUpperCase()}
                                    </div>
                                </div>
                                <div className="course-progress-mini">
                                    <div className="progress-bar-wrap">
                                        <div className="progress-bar-fill" style={{ width: p.status === 'completed' ? '100%' : p.status === 'in-progress' ? '30%' : '0%' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .profile-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    max-width: 1100px;
                    margin: 0 auto;
                }
                .glass-dark {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    box-shadow: var(--shadow);
                }
                .profile-header-card {
                    padding: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .profile-user-info {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 800;
                    color: white;
                    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
                }
                .profile-text h1 {
                    font-size: 1.8rem;
                    font-weight: 800;
                    margin-bottom: 0.25rem;
                }
                .role-badge {
                    display: inline-block;
                    padding: 0.2rem 0.6rem;
                    background: rgba(255,255,255,0.05);
                    border-radius: 6px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: var(--primary);
                    letter-spacing: 1px;
                }
                .join-date {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-top: 0.4rem;
                }
                .profile-logout-btn {
                    padding: 0.75rem 1.5rem;
                    background: rgba(244, 63, 94, 0.1);
                    border: 1px solid rgba(244, 63, 94, 0.2);
                    color: var(--accent);
                    border-radius: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .profile-logout-btn:hover {
                    background: var(--accent);
                    color: white;
                }

                .profile-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }
                .stat-card {
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }
                .stat-icon-wrap {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .stat-content {
                    display: flex;
                    flex-direction: column;
                }
                .stat-val {
                    font-size: 1.5rem;
                    font-weight: 800;
                }
                .stat-lab {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }

                .profile-main-content {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 2rem;
                }
                .profile-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: var(--text-muted);
                }
                .section-title h2 {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--text);
                }

                .history-table-wrap {
                    overflow: hidden;
                }
                .history-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .history-table th {
                    text-align: left;
                    padding: 1rem 1.5rem;
                    background: rgba(255,255,255,0.02);
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }
                .history-table td {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid var(--border);
                }
                .quiz-cell {
                    display: flex;
                    flex-direction: column;
                }
                .q-title {
                    font-weight: 700;
                    font-size: 0.9rem;
                }
                .q-cat {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                }
                .score-badge {
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    font-weight: 900;
                }
                .score-badge.high { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .score-badge.mid { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .score-badge.low { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
                .points-val {
                    color: #f59e0b;
                    font-weight: 800;
                    font-size: 0.9rem;
                }
                .date-cell {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }

                .profile-courses-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .profile-course-card {
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    transition: 0.2s;
                    position: relative;
                }
                .profile-course-card.locked { opacity: 0.5; }
                .course-icon-box {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                }
                .course-info h3 {
                    font-size: 0.9rem;
                    font-weight: 700;
                }
                .status-pill {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.6rem;
                    font-weight: 800;
                    color: var(--primary);
                    margin-top: 2px;
                }
                .course-progress-mini {
                    margin-left: auto;
                    width: 60px;
                }
                .progress-bar-wrap {
                    height: 4px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: var(--primary);
                }

                @media (max-width: 900px) {
                    .profile-main-content { grid-template-columns: 1fr; }
                    .profile-stats-grid { grid-template-columns: 1fr 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
