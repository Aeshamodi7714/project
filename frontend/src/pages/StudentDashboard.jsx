import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    AreaChart, Area
} from 'recharts';
import {
    AlertCircle, Zap, Brain, TrendingUp, Calendar, BrainCircuit
} from 'lucide-react';
import QuizModal from '../components/QuizModal';

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    const fetchData = () => {
        const userJson = localStorage.getItem('user');
        const userObj = userJson ? JSON.parse(userJson) : null;
        const API_BASE = `http://${window.location.hostname}:5000`;
        const url = userObj ? `${API_BASE}/api/student/${userObj.id}/dashboard` : `${API_BASE}/api/student/dashboard/mock`;

        fetch(url)
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

    const startRecommendedQuiz = async () => {
        try {
            const API_BASE = `http://${window.location.hostname}:5000`;
            const response = await fetch(`${API_BASE}/api/quiz/mock`);
            const quizData = await response.json();
            setSelectedQuiz(quizData);
            setShowQuiz(true);
        } catch (err) {
            alert("No quiz available for this recommendation yet.");
        }
    };

    const handleTileClick = (label) => {
        switch (label) {
            case "Skill Level":
                setActiveTab('analytics');
                break;
            case "Progress":
                navigate('/courses');
                break;
            case "AI Recommendation":
                startRecommendedQuiz();
                break;
            case "Weak Spot":
                if (data?.weakSpot && data?.weakSpot !== "Take a quiz!") {
                    // Redirect to specific course related to the weak spot
                    // Mapping weak spots to course titles
                    const weakSpotMap = {
                        "JavaScript Core": "Full Stack Ecosystems",
                        "React Fundamentals": "Advanced React Patterns 2024",
                        "Node.js Basics": "Full Stack Ecosystems",
                        "Python": "Python for Data Science"
                    };
                    const courseTitle = weakSpotMap[data.weakSpot] || "Full Stack Ecosystems";
                    navigate(`/courses?title=${encodeURIComponent(courseTitle)}`);
                } else {
                    alert("Take a quiz first to identify your weak spots!");
                }
                break;
            case "Forecast":
                alert(`Ecosystem Forecast: At your current velocity (${data?.overallCompletion}% in 1 week), you will reach Professional level by March and Complete Mastery by ${data?.forecast || "May 2026"}.`);
                break;
            default:
                break;
        }
    };

    if (loading) return (
        <div className="loading-screen" style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <BrainCircuit size={60} className="pulse" color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Initializing Ecosystem</h2>
            <p className="text-muted">Analyzing your intelligent learning path...</p>
        </div>
    );

    const userName = localStorage.getItem('token') ? (data?.user?.name || 'Academic') : 'Guest';

    return (
        <div className="dashboard-wrapper animate-slide-up">
            <header className="dashboard-header-modern" style={{ marginBottom: '1.5rem' }}>
                <div className="welcome-info">
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Welcome, {userName} 🚀</h1>
                    <p className="text-muted">Your intelligent ecosystem is optimized for peak performance.</p>
                </div>
            </header>

            <div className="tab-navigation">
                <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Smart Overview</button>
                <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Deep Analytics</button>
            </div>

            {activeTab === 'overview' && (
                <>
                    <section className="overview-section">
                        <div className="grid-overview">
                            <StatTile
                                icon={<Zap size={22} color="#f59e0b" />}
                                label="Skill Level"
                                value={data?.overallCompletion > 50 ? 'Intermediate' : 'Beginner'}
                                sub="Click for breakdown"
                                onClick={() => handleTileClick("Skill Level")}
                            />
                            <StatTile
                                icon={<TrendingUp size={22} color="#6366f1" />}
                                label="Progress"
                                value={`${data?.overallCompletion || 0}%`}
                                sub="Go to My Courses"
                                onClick={() => handleTileClick("Progress")}
                            />
                            <StatTile
                                icon={<Brain size={22} color="#0ea5e9" />}
                                label="AI Recommendation"
                                value={data?.recommendation || 'Analyzing Path'}
                                sub="Start Intelligent Quiz"
                                highlight
                                onClick={() => handleTileClick("AI Recommendation")}
                            />
                            <StatTile
                                icon={<AlertCircle size={22} color="#f43f5e" />}
                                label="Weak Spot"
                                value={data?.weakSpot || "Take a quiz!"}
                                sub={data?.weakSpot && data?.weakSpot !== "Take a quiz!" ? "Targeted revision available" : "Complete quizzes to see analysis"}
                                onClick={() => handleTileClick("Weak Spot")}
                            />
                            <StatTile
                                icon={<Calendar size={22} color="#10b981" />}
                                label="Forecast"
                                value={data?.forecast || "TBD"}
                                sub="View timeline"
                                onClick={() => handleTileClick("Forecast")}
                            />
                        </div>
                    </section>

                    <div className="main-analytics-grid">
                        <div className="card span-8">
                            <div className="card-top">
                                <h3>Learning Velocity</h3>
                                <p className="text-muted text-sm">Quantifying your progress over time</p>
                            </div>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data?.progressOverTime || [
                                        { date: '12 Feb', p: 0 }, { date: '14 Feb', p: 0 }, { date: '16 Feb', p: 0 }, { date: '18 Feb', p: 0 }
                                    ]}>
                                        <defs>
                                            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                                        <YAxis stroke="var(--text-muted)" fontSize={12} unit="%" />
                                        <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                                        <Area type="monotone" dataKey="p" stroke="var(--primary)" strokeWidth={4} fill="url(#colorArea)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="card span-4">
                            <div className="card-top">
                                <h3>My Study Circles</h3>
                                <p className="text-muted text-sm">Your active research groups</p>
                            </div>
                            <div className="circles-list-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {data?.joinedCircles?.length > 0 ? (
                                    data.joinedCircles.map((circle, idx) => (
                                        <div key={idx} className="joined-circle-item glass" style={{ padding: '0.85rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '3px solid var(--primary)' }}>
                                            <BrainCircuit size={18} color="var(--primary)" />
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{circle}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted text-sm" style={{ textAlign: 'center', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                                        No circles joined yet. <br />
                                        <button onClick={() => navigate('/network')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem' }}>Explore Network</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'analytics' && (
                <div className="main-analytics-grid animate-fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                    <div className="card analytics-card" style={{ minHeight: '500px' }}>
                        <div className="card-top">
                            <h3>Technology Mastery</h3>
                            <p className="text-muted text-sm">Cross-domain competency analysis</p>
                        </div>
                        <div className="chart-wrapper" style={{ height: '380px', marginTop: '1rem' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={[
                                    { subject: 'HTML', A: 90 }, { subject: 'CSS', A: 85 },
                                    { subject: 'JS', A: 65 }, { subject: 'React', A: 45 },
                                    { subject: 'Node', A: 35 }
                                ]} cx="50%" cy="50%" outerRadius="65%">
                                    <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
                                    <PolarAngleAxis dataKey="subject" stroke="var(--text-muted)" fontSize={12} fontWeight={700} />
                                    <Radar dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} dot={true} />
                                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px', background: 'linear-gradient(145deg, var(--surface), rgba(99, 102, 241, 0.05))' }}>
                        <div className="promo-box" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className="orb-icon-wrap" style={{ width: '100px', height: '100px', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                <BrainCircuit size={48} color="var(--primary)" className="float-anim" />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, white, var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Deep Logic Analysis</h3>
                            <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '340px', margin: '0 auto' }}>
                                Advanced behavioral analytics optimized for <b>{data?.progress?.length || 5} trackable nodes</b> in your ecosystem.
                            </p>
                            <div style={{ marginTop: '2.5rem' }}>
                                <button className="auth-btn" style={{ width: 'auto', padding: '1rem 2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 auto' }} onClick={() => navigate('/courses')}>
                                    <TrendingUp size={18} /> View Course Breakdown
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showQuiz && selectedQuiz && (
                <QuizModal
                    quiz={selectedQuiz}
                    userId={JSON.parse(localStorage.getItem('user'))?.id}
                    onClose={() => { setShowQuiz(false); fetchData(); }}
                    onComplete={() => fetchData()}
                />
            )}

            <style jsx>{`
          .stat-tile { cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
          .stat-tile:active { transform: scale(0.95); }
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 2rem; }
          .quiz-modal { width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto; position: relative; padding: 3rem; }
          .analytics-card { position: relative; overflow: visible; }
      `}</style>
        </div>
    );
};

const StatTile = ({ icon, label, value, sub, highlight, onClick }) => (
    <div className={`stat-tile ${highlight ? 'highlight' : ''}`} onClick={onClick}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon}
            <span className="stat-label">{label}</span>
        </div>
        <span className="stat-value">{value}</span>
        <span className="stat-sub">{sub}</span>
    </div>
);

export default StudentDashboard;
