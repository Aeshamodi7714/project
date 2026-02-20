import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    BrainCircuit,
    PlayCircle,
    Clock,
    Search,
    HelpCircle,
    CheckCircle2
} from 'lucide-react';
import QuizModal from '../components/QuizModal';

const Quizzes = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    const API_BASE = `http://${window.location.hostname}:5000`;
    const categories = ['All', 'Frontend', 'Backend', 'Database', 'Language', 'Framework'];

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const search = query.get('search');
        if (search) {
            setSearchTerm(search);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/quizzes`);
                if (!res.ok) throw new Error('Failed to fetch quizzes');
                const data = await res.json();

                const mappedQuizzes = data.map(q => ({
                    ...q,
                    duration: q.duration || '15 min',
                    points: q.points || (q.difficulty === 'hard' ? 400 : q.difficulty === 'medium' ? 200 : 100),
                    category: q.category || q.relatedSkill?.category || 'General'
                }));

                setQuizzes(mappedQuizzes);
            } catch (err) {
                console.error('Quiz fetch error:', err);
                setQuizzes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [API_BASE]);

    const filteredQuizzes = quizzes.filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || quiz.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const startQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        setShowQuizModal(true);
    };

    const handleQuizComplete = () => {
        setShowQuizModal(false);
    };

    if (loading) return <div className="admin-loading">Synthesizing Assessments...</div>;

    return (
        <div className="quizzes-wrapper animate-slide-up">
            <header className="page-header" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap' }}>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '0.5rem' }}>Assessment Lab</h1>
                        <p className="text-muted" style={{ fontSize: '1.2rem' }}>Validate your mastery across the ecosystem.</p>
                    </div>
                    <div className="search-bar-modern" style={{ position: 'relative', width: '400px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search by topic, framework or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1.2rem 1.2rem 1.2rem 3.8rem',
                                borderRadius: '16px',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                color: 'white',
                                outline: 'none',
                                fontSize: '1rem',
                                transition: 'all 0.3s'
                            }}
                        />
                    </div>
                </div>

                <div className="category-tabs" style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                            style={{
                                padding: '0.8rem 1.8rem',
                                borderRadius: '100px',
                                border: '1px solid var(--border)',
                                background: activeCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <div className="quizzes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
                {filteredQuizzes.length > 0 ? (
                    filteredQuizzes.map((quiz) => (
                        <div key={quiz._id} className="card quiz-card-premium animate-fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div className="quiz-bg-accent" style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)', pointerEvents: 'none' }}></div>

                            <div className="quiz-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', padding: '12px', borderRadius: '14px' }}>
                                    <BrainCircuit size={24} />
                                </div>
                                <div className="points-badge" style={{ background: 'var(--primary)', color: 'white', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                                    +{quiz.points} EXP
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.3 }}>{quiz.title}</h3>
                                <div className="quiz-meta-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}><Clock size={14} /> {quiz.duration}</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{quiz.category}</span>
                                    <span className={`difficulty-indicator ${quiz.difficulty}`} style={{ fontSize: '0.85rem', fontWeight: 700 }}>{quiz.difficulty}</span>
                                </div>
                            </div>

                            <button
                                className="auth-btn"
                                style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem' }}
                                onClick={() => startQuiz(quiz)}
                            >
                                <PlayCircle size={18} /> Start Assessment
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 0' }}>
                        <div style={{ opacity: 0.3, marginBottom: '1.5rem' }}>
                            <HelpCircle size={64} style={{ margin: '0 auto' }} />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>No assessments found</h3>
                        <p className="text-muted">Try adjusting your category filters or search query.</p>
                    </div>
                )}
            </div>

            {showQuizModal && selectedQuiz && (
                <QuizModal
                    quiz={selectedQuiz}
                    userId={JSON.parse(localStorage.getItem('user'))?.id}
                    isOpen={showQuizModal}
                    onClose={() => setShowQuizModal(false)}
                    onComplete={handleQuizComplete}
                />
            )}

            <style jsx>{`
                .quiz-card-premium { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid var(--border); }
                .quiz-card-premium:hover { transform: translateY(-10px); border-color: var(--primary); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                .category-pill:hover { border-color: var(--primary); color: white; background: rgba(99, 102, 241, 0.05); }
                .category-pill.active { box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
                .difficulty-indicator.easy { color: #10b981; }
                .difficulty-indicator.medium { color: #f59e0b; }
                .difficulty-indicator.hard { color: #ef4444; }
            `}</style>
        </div>
    );
};

export default Quizzes;
