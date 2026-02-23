import React, { useState, useEffect } from 'react';
import {
    Users, MessageSquare, ShieldAlert, Plus, Trash2, LayoutDashboard,
    BookOpen, ShieldCheck, XOctagon, RefreshCcw, Search, BrainCircuit,
    Edit3, Image, Star, Layers, Globe, Zap, Bot, Database, Save, X
} from 'lucide-react';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Data States
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [books, setBooks] = useState([]);
    const [posts, setPosts] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [circles, setCircles] = useState([]);

    // Form States (for creating/editing)
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        course: { name: '', category: 'Technical', difficulty: 5, content: '' },
        book: { title: '', author: '', category: 'Programming', rating: 4.5, pages: 300, description: '', image: '', content: '' },
        quiz: { title: '', category: 'Frontend', difficulty: 'medium', questions: [{ questionText: '', options: ['', '', '', ''], correctOption: 0 }] },
        circle: { name: '', icon: 'Users', description: '', members: 0 }
    });

    useEffect(() => { fetchAllData(); }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const endpoints = [
                { key: 'stats', url: 'stats' },
                { key: 'users', url: 'users' },
                { key: 'courses', url: 'skills' },
                { key: 'books', url: 'books' },
                { key: 'posts', url: 'posts' },
                { key: 'quizzes', url: 'quizzes' },
                { key: 'circles', url: 'circles' }
            ];

            const results = await Promise.all(endpoints.map(e =>
                fetch(`http://localhost:5000/api/admin/${e.url}`)
                    .then(res => res.ok ? res.json() : [])
                    .catch(() => [])
            ));

            setStats(results[0]);
            setUsers(results[1]);
            setCourses(results[2]);
            setBooks(results[3]);
            setPosts(results[4]);
            setQuizzes(results[5]);
            setCircles(results[6]);
        } catch (err) {
            console.error('Admin Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Generic CRUD Handler
    const handleAction = async (type, action, id = null, data = null) => {
        const endpointMap = {
            user: 'users',
            course: 'skills',
            book: 'books',
            post: 'posts',
            quiz: 'quizzes',
            circle: 'circles'
        };

        const baseURL = `http://localhost:5000/api/admin/${endpointMap[type]}`;
        const url = id ? `${baseURL}/${id}` : baseURL;

        // Custom logic for User Status
        if (type === 'user' && action === 'status') {
            const user = users.find(u => u._id === id);
            const nextStatus = user.status === 'active' ? 'blocked' : 'active';
            await fetch(`${baseURL}/${id}/status`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });
            return fetchAllData();
        }

        let method = 'GET';
        if (action === 'delete') {
            if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
            method = 'DELETE';
        } else if (action === 'create') {
            method = 'POST';
        } else if (action === 'update') {
            method = 'PUT';
        }

        try {
            const res = await fetch(index_url(baseURL, id, action, type), {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: data ? JSON.stringify(data) : null
            });
            if (res.ok) {
                if (action !== 'delete') resetForm(type);
                fetchAllData();
                alert(`${type.toUpperCase()} ${action}d successfully!`);
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error || 'Operation failed'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Connection error. Is the backend running?');
        }
    };

    const index_url = (base, id, action, type) => {
        if (action === 'delete' || action === 'update') return `${base}/${id}`;
        return base;
    }

    const resetForm = (type) => {
        setIsEditing(false);
        setCurrentId(null);
        const defaults = {
            course: { name: '', category: 'Technical', difficulty: 5, content: '' },
            book: { title: '', author: '', category: 'Programming', rating: 4.5, pages: 300, description: '', image: '', content: '' },
            quiz: { title: '', category: 'Frontend', difficulty: 'medium', questions: [{ questionText: '', options: ['', '', '', ''], correctOption: 0 }] },
            circle: { name: '', icon: 'Users', description: '', members: 0 }
        };
        setFormData({ ...formData, [type]: defaults[type] });
    };

    const startEdit = (type, item) => {
        setIsEditing(true);
        setCurrentId(item._id);
        setFormData({ ...formData, [type]: { ...item } });
    };

    if (loading) return <div className="admin-loading-screen">
        <div className="loader-orbit"><div className="loader-core"></div></div>
        <span>Initializing Control Center...</span>
    </div>;

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-nav-sidebar glass">
                <div className="nav-brand">
                    <BrainCircuit size={28} color="var(--primary)" />
                    <span>ALME <small>ADMIN</small></span>
                </div>
                <nav className="nav-menu">
                    <NavBtn icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <NavBtn icon={<Users />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <NavBtn icon={<Zap />} label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                    <NavBtn icon={<BookOpen />} label="Library" active={activeTab === 'books'} onClick={() => setActiveTab('books')} />
                    <NavBtn icon={<Bot />} label="Quizzes" active={activeTab === 'quizzes'} onClick={() => setActiveTab('quizzes')} />
                    <NavBtn icon={<Globe />} label="Network" active={activeTab === 'network'} onClick={() => setActiveTab('network')} />
                    <NavBtn icon={<Layers />} label="Circles" active={activeTab === 'circles'} onClick={() => setActiveTab('circles')} />
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-content-viewport">
                <header className="admin-topbar">
                    <div className="search-box glass">
                        <Search size={18} />
                        <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="admin-actions">
                        <button className="sync-btn" onClick={fetchAllData}><RefreshCcw size={18} /></button>
                        <div className="admin-profile-badge">
                            <span className="name">ALME Admin</span>
                            <ShieldCheck size={20} color="#10b981" />
                        </div>
                    </div>
                </header>

                <div className="view-container animate-fade-in">
                    {activeTab === 'dashboard' && <DashboardView stats={stats} />}
                    {activeTab === 'users' && <UserManager users={users} searchTerm={searchTerm} onStatus={handleAction} onDelete={handleAction} />}
                    {activeTab === 'courses' && <CourseManager
                        data={courses} formData={formData.course}
                        isEditing={isEditing} setForm={(d) => setFormData({ ...formData, course: d })}
                        onSave={(id) => handleAction('course', id ? 'update' : 'create', id, formData.course)}
                        onDelete={(id) => handleAction('course', 'delete', id)}
                        onEdit={(item) => startEdit('course', item)}
                        onReset={() => resetForm('course')}
                        searchTerm={searchTerm}
                    />}
                    {activeTab === 'books' && <BookManager
                        data={books} formData={formData.book}
                        isEditing={isEditing} setForm={(d) => setFormData({ ...formData, book: d })}
                        onSave={(id) => handleAction('book', id ? 'update' : 'create', id, formData.book)}
                        onDelete={(id) => handleAction('book', 'delete', id)}
                        onEdit={(item) => startEdit('book', item)}
                        onReset={() => resetForm('book')}
                        searchTerm={searchTerm}
                    />}
                    {activeTab === 'quizzes' && <QuizManager
                        data={quizzes} formData={formData.quiz}
                        isEditing={isEditing} setForm={(d) => setFormData({ ...formData, quiz: d })}
                        onSave={(id) => handleAction('quiz', id ? 'update' : 'create', id, formData.quiz)}
                        onDelete={(id) => handleAction('quiz', 'delete', id)}
                        onEdit={(item) => startEdit('quiz', item)}
                        onReset={() => resetForm('quiz')}
                        searchTerm={searchTerm}
                    />}
                    {activeTab === 'network' && <NetworkManager data={posts} onDelete={(id) => handleAction('post', 'delete', id)} searchTerm={searchTerm} />}
                    {activeTab === 'circles' && <CircleManager
                        data={circles} formData={formData.circle}
                        isEditing={isEditing} setForm={(d) => setFormData({ ...formData, circle: d })}
                        onSave={(id) => handleAction('circle', id ? 'update' : 'create', id, formData.circle)}
                        onDelete={(id) => handleAction('circle', 'delete', id)}
                        onEdit={(item) => startEdit('circle', item)}
                        onReset={() => resetForm('circle')}
                        searchTerm={searchTerm}
                    />}
                </div>
            </main>

            <style jsx>{`
                .admin-layout { display: grid; grid-template-columns: 280px 1fr; height: 100vh; background: #0a0e17; color: #f8fafc; font-family: 'Inter', sans-serif; overflow: hidden; }
                .admin-nav-sidebar { padding: 2.5rem 1.5rem; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(15px); border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 3.5rem; }
                .nav-brand { display: flex; align-items: center; gap: 1rem; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; }
                .nav-brand span { background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .nav-brand small { font-size: 0.65rem; background: var(--primary); -webkit-text-fill-color: white; padding: 2px 8px; border-radius: 6px; font-weight: 900; margin-left: 5px; box-shadow: 0 0 15px rgba(99,102,241,0.3); }
                .nav-menu { display: flex; flex-direction: column; gap: 0.6rem; }
                
                .admin-content-viewport { overflow-y: auto; display: flex; flex-direction: column; padding: 2.5rem 3.5rem; gap: 2.5rem; background: radial-gradient(circle at top right, rgba(99,102,241,0.05), transparent 40%); }
                .admin-topbar { display: flex; justify-content: space-between; align-items: center; }
                .search-box { display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.8rem; border-radius: 100px; width: 450px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
                .search-box input { background: transparent; border: none; color: white; width: 100%; outline: none; font-size: 0.95rem; }
                
                .admin-actions { display: flex; align-items: center; gap: 2.5rem; }
                .sync-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); width: 46px; height: 46px; border-radius: 14px; color: #94a3b8; cursor: pointer; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                .sync-btn:hover { background: rgba(99,102,241,0.2); color: white; transform: rotate(180deg) scale(1.05); border-color: rgba(99,102,241,0.4); }
                .admin-profile-badge { display: flex; align-items: center; gap: 1rem; background: rgba(99,102,241,0.1); padding: 0.6rem 1.2rem; border-radius: 100px; border: 1px solid rgba(99,102,241,0.2); }
                .admin-profile-badge .name { font-weight: 600; font-size: 0.9rem; color: #e2e8f0; }

                .admin-loading-screen { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; background: #070b14; color: #94a3b8; }
                .loader-orbit { width: 60px; height: 60px; border: 3px solid var(--primary); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }

                /* Generic Views Styling */
                .manager-container { display: grid; grid-template-columns: 1fr 420px; gap: 3rem; align-items: start; }
                .list-section { background: rgba(15, 23, 42, 0.6); border-radius: 32px; padding: 2rem; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
                .form-section { position: sticky; top: 2rem; }
                
                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .section-header h3 { font-size: 1.4rem; font-weight: 700; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                .admin-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
                .admin-table th { text-align: left; padding: 1.2rem; color: #64748b; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .admin-table tr { background: transparent; transition: 0.3s; }
                .admin-table tbody tr:hover { background: rgba(255,255,255,0.02); }
                .admin-table td { padding: 1.5rem 1.2rem; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.02); }
                
                .action-row { display: flex; gap: 0.6rem; }
                .btn-icon { width: 38px; height: 38px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .btn-icon:hover { background: rgba(99, 102, 241, 0.15); color: white; border-color: rgba(99, 102, 241, 0.3); }
                .btn-icon.delete:hover { background: rgba(244, 63, 94, 0.15); color: #f43f5e; border-color: rgba(244, 63, 94, 0.3); }
                
                .glass-form { background: rgba(23, 37, 84, 0.4); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.1); border-radius: 32px; padding: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem; box-shadow: 0 30px 60px rgba(0,0,0,0.4); position: relative; overflow: hidden; }
                .glass-form::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(to right, var(--primary), #a855f7); }
                .glass-form h3 { font-size: 1.5rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.8rem; }
                
                .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
                .form-group label { font-size: 0.85rem; font-weight: 600; color: #94a3b8; }
                .glass-form input, .glass-form select, .glass-form textarea { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.12); padding: 1rem 1.2rem; border-radius: 14px; color: white; outline: none; transition: 0.3s; font-size: 0.95rem; }
                .glass-form input:focus, .glass-form select:focus, .glass-form textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15); background: rgba(15, 23, 42, 0.8); }
                
                .btn-save { background: linear-gradient(135deg, var(--primary), #4f46e5); color: white; border: none; padding: 1.2rem; border-radius: 16px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.8rem; transition: 0.4s; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3); font-size: 1rem; }
                .btn-save:hover { transform: translateY(-3px) scale(1.02); filter: brightness(1.2); box-shadow: 0 15px 35px rgba(99, 102, 241, 0.5); }
                
                .btn-cancel { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 1rem; border-radius: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .btn-cancel:hover { background: rgba(255,255,255,0.1); color: white; }

                .btn-new { background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; transition: 0.4s; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2); }
                .btn-new:hover { transform: translateY(-3px); box-shadow: 0 12px 25px rgba(16, 185, 129, 0.4); }

                @keyframes spin { to { transform: rotate(360deg); } }
                .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const NavBtn = ({ icon, label, active, onClick }) => (
    <button className={`nav-btn ${active ? 'active' : ''}`} onClick={onClick}>
        <span className="icon">{icon}</span>
        <span className="label">{label}</span>
        <style jsx>{`
            .nav-btn { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; border-radius: 16px; transition: 0.3s; font-weight: 600; width: 100%; }
            .nav-btn:hover { background: rgba(255,255,255,0.05); color: white; }
            .nav-btn.active { background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1)); border: 1px solid rgba(99,102,241,0.2); color: white; }
            .nav-btn.active .icon { color: var(--primary); }
        `}</style>
    </button>
);

const DashboardView = ({ stats }) => (
    <div className="dashboard-view-admin">
        <h2 className="view-title">Platform Intelligence Dashboard</h2>
        <div className="stats-grid-admin">
            <DashCard icon={<Users />} label="Total Students" value={stats?.totalStudents} color="#6366f1" />
            <DashCard icon={<Bot />} label="Active Quizzes" value={stats?.totalQuizzes} color="#a855f7" />
            <DashCard icon={<Edit3 />} label="Total Attempts" value={stats?.totalAttempts} color="#ec4899" />
            <DashCard icon={<ShieldAlert />} label="At-Risk Users" value={stats?.atRisk} color="#f43f5e" />
        </div>

        <div className="discovery-row">
            <div className="discovery-card glass">
                <h3><Zap size={20} /> Adaptive Learning Rules</h3>
                <div className="rule-box">
                    <div className="rule"><span>Mastery &gt; 85%</span> <span className="p-badge">Fast Track</span></div>
                    <div className="rule"><span>Score &lt; 50%</span> <span className="r-badge">Remedial</span></div>
                </div>
            </div>
            <div className="discovery-card glass">
                <h3><Database size={20} /> System Health</h3>
                <div className="health-bar-container">
                    <div className="health-label"><span>Database Latency</span> <span>12ms</span></div>
                    <div className="health-bar"><div className="fill" style={{ width: '98%' }}></div></div>
                </div>
            </div>
        </div>

        <style jsx>{`
            .stats-grid-admin { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 1.5rem; }
            .discovery-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem; }
            .discovery-card { padding: 2rem; border-radius: 24px; display: flex; flex-direction: column; gap: 1.5rem; }
            .rule-box { display: flex; flex-direction: column; gap: 1rem; }
            .rule { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 12px; }
            .p-badge { background: #10b981; font-size: 0.7rem; padding: 4px 10px; border-radius: 100px; font-weight: 800; }
            .r-badge { background: #f43f5e; font-size: 0.7rem; padding: 4px 10px; border-radius: 100px; font-weight: 800; }
            .health-bar-container { display: flex; flex-direction: column; gap: 0.8rem; }
            .health-label { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-muted); }
            .health-bar { height: 8px; background: rgba(255,255,255,0.05); border-radius: 100px; overflow: hidden; }
            .health-bar .fill { height: 100%; background: #10b981; }
        `}</style>
    </div>
);

const DashCard = ({ icon, label, value, color }) => (
    <div className="dash-card glass">
        <div className="icon-wrap" style={{ background: `${color}20`, color: color }}>{icon}</div>
        <div className="info">
            <h4>{label}</h4>
            <div className="val">{value || 0}</div>
        </div>
        <style jsx>{`
            .dash-card { padding: 1.5rem; border-radius: 20px; display: flex; align-items: center; gap: 1.2rem; }
            .icon-wrap { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
            .info h4 { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.2rem; }
            .info .val { font-size: 1.8rem; font-weight: 800; }
        `}</style>
    </div>
);

const UserManager = ({ users, searchTerm, onStatus, onDelete }) => (
    <div className="list-section">
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                    <tr key={user._id}>
                        <td>{user.name}</td>
                        <td style={{ opacity: 0.6 }}>{user.email}</td>
                        <td><span className={`status-tag ${user.status}`}>{user.status}</span></td>
                        <td>
                            <div className="prog-mini">
                                <div className="bar"><div className="fill" style={{ width: `${user.progress}%` }}></div></div>
                                <span>{user.progress}%</span>
                            </div>
                        </td>
                        <td className="action-row">
                            <button className="btn-icon" onClick={() => onStatus('user', 'status', user._id)} title="Toggle Status">
                                {user.status === 'active' ? <XOctagon size={16} /> : <ShieldCheck size={16} />}
                            </button>
                            <button className="btn-icon delete" onClick={() => onDelete('user', 'delete', user._id)}><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <style jsx>{`
            .status-tag { padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
            .status-tag.active { background: rgba(16, 185, 129, 0.2); color: #10b981; }
            .status-tag.blocked { background: rgba(244, 63, 94, 0.2); color: #f43f5e; }
            .prog-mini { display: flex; align-items: center; gap: 10px; }
            .prog-mini .bar { width: 60px; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
            .prog-mini .fill { height: 100%; background: var(--primary); }
            .prog-mini span { font-size: 0.8rem; font-weight: 600; }
        `}</style>
    </div>
);

const CourseManager = ({ data, formData, isEditing, setForm, onSave, onDelete, onEdit, onReset, searchTerm }) => (
    <div className="manager-container">
        <div className="list-section">
            <div className="section-header">
                <h3>Course Catalog</h3>
                <button className="btn-new" onClick={onReset}><Plus size={18} /> New Course</button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr><th>Name</th><th>Category</th><th>Difficulty</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {data.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.difficulty}/10</td>
                            <td className="action-row">
                                <button className="btn-icon" onClick={() => onEdit(item)}><Edit3 size={16} /></button>
                                <button className="btn-icon delete" onClick={() => onDelete(item._id)}><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="form-section">
            <div className="glass-form">
                <h3>{isEditing ? 'Edit Course' : 'Add New Course'}</h3>
                <div className="form-group">
                    <label>Course Name</label>
                    <input type="text" value={formData.name} onChange={e => setForm({ ...formData, name: e.target.value })} placeholder="e.g. Advanced Python" />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select value={formData.category} onChange={e => setForm({ ...formData, category: e.target.value })}>
                        <option>Technical</option><option>Academic</option><option>Professional</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Difficulty ({formData.difficulty})</label>
                    <input type="range" min="1" max="10" value={formData.difficulty} onChange={e => setForm({ ...formData, difficulty: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                    <label>Content Preview</label>
                    <textarea value={formData.content} onChange={e => setForm({ ...formData, content: e.target.value })} rows="4" placeholder="Course description..."></textarea>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {isEditing && <button className="btn-cancel" onClick={onReset}><X size={18} /> Cancel</button>}
                    <button className="btn-save" onClick={() => onSave(isEditing ? formData._id : null)} style={{ gridColumn: isEditing ? 'auto' : 'span 2' }}>
                        <Save size={18} /> {isEditing ? 'Update Course' : 'Create Course'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const BookManager = ({ data, formData, isEditing, setForm, onSave, onDelete, onEdit, onReset, searchTerm }) => (
    <div className="manager-container">
        <div className="list-section">
            <div className="section-header">
                <h3>Digital Library</h3>
                <button className="btn-new" onClick={onReset}><Plus size={18} /> Add Book</button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr><th>Book</th><th>Author</th><th>Category</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {data.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                        <tr key={item._id}>
                            <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={item.image} style={{ width: '30px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                {item.title}
                            </td>
                            <td>{item.author}</td>
                            <td>{item.category}</td>
                            <td className="action-row">
                                <button className="btn-icon" onClick={() => onEdit(item)}><Edit3 size={16} /></button>
                                <button className="btn-icon delete" onClick={() => onDelete(item._id)}><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="form-section">
            <div className="glass-form">
                <h3>{isEditing ? 'Edit Book' : 'Add to Library'}</h3>
                <div className="form-group"><label>Title</label><input type="text" value={formData.title} onChange={e => setForm({ ...formData, title: e.target.value })} /></div>
                <div className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group"><label>Author</label><input type="text" value={formData.author} onChange={e => setForm({ ...formData, author: e.target.value })} /></div>
                    <div className="form-group"><label>Category</label><input type="text" value={formData.category} onChange={e => setForm({ ...formData, category: e.target.value })} /></div>
                </div>
                <div className="form-group"><label>Cover Image URL</label><input type="text" value={formData.image} onChange={e => setForm({ ...formData, image: e.target.value })} /></div>
                <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={e => setForm({ ...formData, description: e.target.value })} rows="4"></textarea></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {isEditing && <button className="btn-cancel" onClick={onReset}><X size={18} /> Cancel</button>}
                    <button className="btn-save" onClick={() => onSave(isEditing ? formData._id : null)} style={{ gridColumn: isEditing ? 'auto' : 'span 2' }}>
                        <Save size={18} /> {isEditing ? 'Save Book' : 'Publish Book'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const QuizManager = ({ data, formData, isEditing, setForm, onSave, onDelete, onEdit, onReset, searchTerm }) => (
    <div className="manager-container">
        <div className="list-section">
            <div className="section-header">
                <h3>Quiz Challenges</h3>
                <button className="btn-new" onClick={onReset}><Plus size={18} /> New Quiz</button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr><th>Title</th><th>Category</th><th>Questions</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {data.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                        <tr key={item._id}>
                            <td>{item.title}</td>
                            <td>{item.category || 'N/A'}</td>
                            <td>{item.questions?.length || 0}</td>
                            <td className="action-row">
                                <button className="btn-icon" onClick={() => onEdit(item)}><Edit3 size={16} /></button>
                                <button className="btn-icon delete" onClick={() => onDelete(item._id)}><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="form-section">
            <div className="glass-form">
                <h3>{isEditing ? 'Modify Quiz' : 'New Challenge'}</h3>
                <input type="text" value={formData.title} onChange={e => setForm({ ...formData, title: e.target.value })} placeholder="Quiz Title" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <select value={formData.category} onChange={e => setForm({ ...formData, category: e.target.value })}>
                        <option>Frontend</option><option>Backend</option><option>Database</option>
                    </select>
                    <select value={formData.difficulty} onChange={e => setForm({ ...formData, difficulty: e.target.value })}>
                        <option>easy</option><option>medium</option><option>hard</option>
                    </select>
                </div>
                <div className="questions-list" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '10px' }}>
                    {formData.questions.map((q, i) => (
                        <div key={i} style={{ marginBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                            <input value={q.questionText} onChange={e => {
                                const qs = [...formData.questions]; qs[i].questionText = e.target.value;
                                setForm({ ...formData, questions: qs });
                            }} placeholder={`Q${i + 1} Text`} />
                        </div>
                    ))}
                </div>
                <button className="btn-new" onClick={() => setForm({ ...formData, questions: [...formData.questions, { questionText: '', options: ['', '', '', ''], correctOption: 0 }] })} style={{ width: '100%', justifyContent: 'center' }}>+ Add Question</button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {isEditing && <button className="btn-cancel" onClick={onReset}><X size={18} /> Cancel</button>}
                    <button className="btn-save" onClick={() => onSave(isEditing ? formData._id : null)} style={{ gridColumn: isEditing ? 'auto' : 'span 2' }}>
                        <Save size={18} /> {isEditing ? 'Update Quiz' : 'Finalize Quiz'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const NetworkManager = ({ data, onDelete, searchTerm }) => (
    <div className="list-section">
        <table className="admin-table">
            <thead>
                <tr><th>Author</th><th>Content Preview</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {data.filter(i => i.content.toLowerCase().includes(searchTerm.toLowerCase()) || i.user.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                    <tr key={item._id}>
                        <td>{item.user}</td>
                        <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.content}</td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="action-row">
                            <button className="btn-icon delete" onClick={() => onDelete(item._id)}><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const CircleManager = ({ data, formData, isEditing, setForm, onSave, onDelete, onEdit, onReset, searchTerm }) => (
    <div className="manager-container">
        <div className="list-section">
            <div className="section-header">
                <h3>Learning Circles</h3>
                <button className="btn-new" onClick={onReset}><Plus size={18} /> New Circle</button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr><th>Name</th><th>Desc</th><th>Members</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {data.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td style={{ fontSize: '0.8rem', color: '#888' }}>{item.description}</td>
                            <td>{item.members}</td>
                            <td className="action-row">
                                <button className="btn-icon" onClick={() => onEdit(item)}><Edit3 size={16} /></button>
                                <button className="btn-icon delete" onClick={() => onDelete(item._id)}><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="form-section">
            <div className="glass-form">
                <h3>Manage Circle</h3>
                <input type="text" value={formData.name} onChange={e => setForm({ ...formData, name: e.target.value })} placeholder="Circle Name" />
                <textarea value={formData.description} onChange={e => setForm({ ...formData, description: e.target.value })} placeholder="Description..."></textarea>
                <div className="form-group"><label>Icon Name (Lucide)</label><input type="text" value={formData.icon} onChange={e => setForm({ ...formData, icon: e.target.value })} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {isEditing && <button className="btn-cancel" onClick={onReset}><X size={18} /> Cancel</button>}
                    <button className="btn-save" onClick={() => onSave(isEditing ? formData._id : null)} style={{ gridColumn: isEditing ? 'auto' : 'span 2' }}>
                        <Save size={18} /> {isEditing ? 'Update Circle' : 'Start Circle'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default AdminPanel;
