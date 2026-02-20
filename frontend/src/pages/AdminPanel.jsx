import React, { useState, useEffect } from 'react';
import {
    Users,
    MessageSquare,
    ShieldAlert,
    Plus,
    Trash2,
    LayoutDashboard,
    BookOpen,
    ShieldCheck,
    XOctagon,
    RefreshCcw,
    Search,
    BrainCircuit
} from 'lucide-react';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [skills, setSkills] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditingQuiz, setIsEditingQuiz] = useState(false);
    const [currentQuizId, setCurrentQuizId] = useState(null);

    // Quiz Form State
    const [newQuiz, setNewQuiz] = useState({
        title: '',
        category: 'Frontend',
        difficulty: 'medium',
        questions: [{ questionText: '', options: ['', '', '', ''], correctOption: 0 }]
    });

    // Skill Form State
    const [newSkill, setNewSkill] = useState({
        name: '',
        category: 'Academic',
        difficulty: 5,
        content: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sRes, uRes, qRes, skRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/stats'),
                fetch('http://localhost:5000/api/admin/users'),
                fetch('http://localhost:5000/api/admin/quizzes'),
                fetch('http://localhost:5000/api/admin/skills')
            ]);
            setStats(await sRes.json());
            setUsers(await uRes.json());
            setQuizzes(await qRes.json());
            setSkills(await skRes.json());
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        try {
            await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await fetch(`http://localhost:5000/api/admin/users/${userId}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddQuestion = () => {
        setNewQuiz({
            ...newQuiz,
            questions: [...newQuiz.questions, { questionText: '', options: ['', '', '', ''], correctOption: 0 }]
        });
    };

    const handleSaveQuiz = async (e) => {
        e.preventDefault();
        const url = isEditingQuiz
            ? `http://localhost:5000/api/admin/quizzes/${currentQuizId}`
            : 'http://localhost:5000/api/admin/quizzes';
        const method = isEditingQuiz ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newQuiz)
            });
            if (res.ok) {
                alert(`Quiz ${isEditingQuiz ? 'updated' : 'created'} successfully!`);
                setNewQuiz({
                    title: '', category: 'Frontend', difficulty: 'medium',
                    questions: [{ questionText: '', options: ['', '', '', ''], correctOption: 0 }]
                });
                setIsEditingQuiz(false);
                setCurrentQuizId(null);
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const prepareEditQuiz = (quiz) => {
        setNewQuiz({
            title: quiz.title,
            category: quiz.category,
            difficulty: quiz.difficulty,
            questions: quiz.questions
        });
        setIsEditingQuiz(true);
        setCurrentQuizId(quiz._id);
        setActiveTab('quizzes'); // Ensure we are on the quizzes tab
    };

    const deleteQuiz = async (quizId) => {
        if (!window.confirm('Delete this quiz?')) return;
        try {
            await fetch(`http://localhost:5000/api/admin/quizzes/${quizId}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/admin/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSkill)
            });
            if (res.ok) {
                alert('Course (Skill) added successfully!');
                setNewSkill({ name: '', category: 'Academic', difficulty: 5, content: '' });
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteSkill = async (skillId) => {
        if (!window.confirm('Delete this course?')) return;
        try {
            await fetch(`http://localhost:5000/api/admin/skills/${skillId}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="admin-loading">Initializing Control Center...</div>;

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-panel-container">
            {/* Admin Sidebar */}
            <aside className="admin-sidebar glass">
                <div className="sidebar-brand">
                    <BrainCircuit color="var(--primary)" size={32} />
                    <span>ALME ADMIN</span>
                </div>
                <nav className="admin-nav">
                    <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>
                        <Users size={20} /> User Manager
                    </button>
                    <button onClick={() => setActiveTab('courses')} className={activeTab === 'courses' ? 'active' : ''}>
                        <BookOpen size={20} /> Course Manager
                    </button>
                    <button onClick={() => setActiveTab('quizzes')} className={activeTab === 'quizzes' ? 'active' : ''}>
                        <MessageSquare size={20} /> Quiz Manager
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {activeTab === 'dashboard' && (
                    <div className="admin-view animate-fade-in">
                        <header className="view-header">
                            <h1>Platform Intelligence</h1>
                            <button className="btn-refresh" onClick={fetchData}><RefreshCcw size={16} /></button>
                        </header>
                        <div className="admin-stats-grid">
                            <div className="admin-stat-card">
                                <h3>Total Students</h3>
                                <div className="stat-val">{stats?.totalStudents}</div>
                                <Users size={40} className="stat-icon-bg" />
                            </div>
                            <div className="admin-stat-card">
                                <h3>Active Quizzes</h3>
                                <div className="stat-val">{stats?.totalQuizzes}</div>
                                <BookOpen size={40} className="stat-icon-bg" />
                            </div>
                            <div className="admin-stat-card danger">
                                <h3>At-Risk Users</h3>
                                <div className="stat-val">{stats?.atRisk}</div>
                                <ShieldAlert size={40} className="stat-icon-bg" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="admin-view animate-fade-in">
                        <header className="view-header">
                            <h1>User Directory</h1>
                            <div className="search-bar-admin">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </header>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Progress</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`status-badge ${user.status}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-progress-container">
                                                <div className="admin-progress-bar">
                                                    <div
                                                        className="admin-progress-fill"
                                                        style={{ width: `${user.progress || 0}%` }}
                                                    ></div>
                                                </div>
                                                <span className="admin-progress-text">{user.progress || 0}%</span>
                                            </div>
                                        </td>
                                        <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
                                        <td className="actions">
                                            <button
                                                className="btn-status"
                                                onClick={() => toggleUserStatus(user._id, user.status)}
                                                title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                                            >
                                                {user.status === 'active' ? <XOctagon size={18} /> : <ShieldCheck size={18} />}
                                            </button>
                                            <button className="btn-delete" onClick={() => deleteUser(user._id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="admin-view animate-fade-in">
                        <div className="quiz-mgmt-grid">
                            <div className="quiz-form-section">
                                <header className="view-header">
                                    <h1>Add New Course</h1>
                                </header>
                                <form onSubmit={handleCreateSkill} className="admin-form glass">
                                    <input
                                        type="text"
                                        placeholder="Course Name"
                                        value={newSkill.name}
                                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                        required
                                    />
                                    <div className="form-row">
                                        <select value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}>
                                            <option>Academic</option>
                                            <option>Professional</option>
                                            <option>Technical</option>
                                        </select>
                                        <input
                                            type="number"
                                            min="1" max="10"
                                            placeholder="Difficulty (1-10)"
                                            value={newSkill.difficulty}
                                            onChange={(e) => setNewSkill({ ...newSkill, difficulty: e.target.value })}
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Course Description/Content"
                                        value={newSkill.content}
                                        onChange={(e) => setNewSkill({ ...newSkill, content: e.target.value })}
                                    />
                                    <button type="submit" className="btn-submit">Add Course</button>
                                </form>
                            </div>

                            <div className="quiz-list-section">
                                <header className="view-header">
                                    <h1>Library Courses</h1>
                                </header>
                                <div className="admin-quiz-list">
                                    {skills.map(skill => (
                                        <div key={skill._id} className="admin-quiz-card glass">
                                            <div className="q-info">
                                                <h4>{skill.name}</h4>
                                                <span>{skill.category} • Diff: {skill.difficulty}</span>
                                            </div>
                                            <button onClick={() => deleteSkill(skill._id)} className="btn-delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'quizzes' && (
                    <div className="admin-view animate-fade-in">
                        <div className="quiz-mgmt-grid">
                            <div className="quiz-form-section">
                                <header className="view-header">
                                    <h1>{isEditingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h1>
                                </header>
                                <form onSubmit={handleSaveQuiz} className="admin-form glass">
                                    <input
                                        type="text"
                                        placeholder="Quiz Title"
                                        value={newQuiz.title}
                                        onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                                        required
                                    />
                                    <div className="form-row">
                                        <select value={newQuiz.category} onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}>
                                            <option>Frontend</option>
                                            <option>Backend</option>
                                            <option>Database</option>
                                            <option>Academic</option>
                                        </select>
                                        <select value={newQuiz.difficulty} onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}>
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>

                                    <div className="questions-editor">
                                        <h3>Questions ({newQuiz.questions.length})</h3>
                                        {newQuiz.questions.map((q, idx) => (
                                            <div key={idx} className="q-item" style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                                                <input
                                                    placeholder={`Question ${idx + 1}`}
                                                    value={q.questionText}
                                                    onChange={(e) => {
                                                        const qs = [...newQuiz.questions];
                                                        qs[idx].questionText = e.target.value;
                                                        setNewQuiz({ ...newQuiz, questions: qs });
                                                    }}
                                                    style={{ marginBottom: '0.5rem' }}
                                                />
                                                <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                    {q.options.map((opt, optIdx) => (
                                                        <input
                                                            key={optIdx}
                                                            placeholder={`Option ${optIdx + 1}`}
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const qs = [...newQuiz.questions];
                                                                qs[idx].options[optIdx] = e.target.value;
                                                                setNewQuiz({ ...newQuiz, questions: qs });
                                                            }}
                                                            style={{ fontSize: '0.8rem' }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" onClick={handleAddQuestion} className="btn-add-q">
                                            <Plus size={16} /> Add Question
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className="btn-submit" style={{ flex: 1 }}>
                                            {isEditingQuiz ? 'Update Quiz' : 'Publish Quiz'}
                                        </button>
                                        {isEditingQuiz && (
                                            <button
                                                type="button"
                                                className="btn-delete"
                                                style={{ width: 'auto', padding: '0 1.5rem', height: 'auto' }}
                                                onClick={() => {
                                                    setIsEditingQuiz(false);
                                                    setNewQuiz({
                                                        title: '', category: 'Frontend', difficulty: 'medium',
                                                        questions: [{ questionText: '', options: ['', '', '', ''], correctOption: 0 }]
                                                    });
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="quiz-list-section">
                                <header className="view-header">
                                    <h1>Existing Quizzes</h1>
                                </header>
                                <div className="admin-quiz-list">
                                    {quizzes.map(quiz => (
                                        <div key={quiz._id} className="admin-quiz-card glass">
                                            <div className="q-info">
                                                <h4>{quiz.title}</h4>
                                                <span>{quiz.questions.length} Questions • {quiz.category}</span>
                                            </div>
                                            <div className="actions">
                                                <button onClick={() => prepareEditQuiz(quiz)} className="btn-status" title="Edit Quiz">
                                                    <RefreshCcw size={18} />
                                                </button>
                                                <button onClick={() => deleteQuiz(quiz._id)} className="btn-delete" title="Delete Quiz">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
