import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    Users,
    CheckCircle,
    AlertTriangle,
    Activity,
    Zap,
    Database
} from 'lucide-react';

const activeStudentsData = [
    { month: 'Jan', students: 400 },
    { month: 'Feb', students: 600 },
    { month: 'Mar', students: 800 },
    { month: 'Apr', students: 750 },
];

const completionData = [
    { name: 'Completed', value: 400 },
    { name: 'In Progress', value: 300 },
    { name: 'Dropped', value: 100 },
];
const COLORS = ['#10b981', '#6366f1', '#f43f5e'];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/admin/stats')
            .then(res => res.json())
            .then(json => {
                setStats(json);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Platform Intelligence...</div>;

    return (
        <div className="admin-wrapper">
            <header className="page-header">
                <div>
                    <h1>Control Center 🛡️</h1>
                    <p className="text-muted">Global platform analytics and AI management.</p>
                </div>
            </header>

            <div className="stats-grid">
                <StatCard icon={<Users size={24} />} label="Total Students" value={stats?.totalStudents || 0} sub="Registered users" />
                <StatCard icon={<Activity size={24} />} label="Active Now" value={stats?.activeNow || 0} sub="Live Sessions" />
                <StatCard icon={<CheckCircle size={24} />} label="Avg. Success" value={`${stats?.completionRate || 0}%`} sub="Platform KPI" />
                <StatCard icon={<AlertTriangle size={24} />} label="At-Risk" value={stats?.atRisk || 0} sub="Require intervention" />
            </div>

            <div className="admin-grid-layout">
                <div className="card chart-card span-8">
                    <h3>Growth Analytics</h3>
                    <div className="chart-container">
                        <ResponsiveContainer>
                            <AreaChart data={activeStudentsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="month" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip />
                                <Area type="monotone" dataKey="students" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card span-4">
                    <h3>Completion Rate</h3>
                    <div className="chart-container">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={completionData} innerRadius={60} outerRadius={80} dataKey="value">
                                    {completionData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="admin-grid-layout">
                <div className="card management-card span-6">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <Database size={20} />
                        <h3>Skill Graph Manager</h3>
                    </div>
                    <p className="text-muted text-sm">Define dependencies between skills and set difficulty thresholds.</p>
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', cursor: 'pointer' }}>Edit Taxonomy</button>
                        <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', cursor: 'pointer' }}>View Graph</button>
                    </div>
                </div>

                <div className="card management-card span-6">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <Zap size={20} />
                        <h3>AI Adaptive Rules</h3>
                    </div>
                    <div className="rule-item">
                        <span>Score &lt; 50%</span>
                        <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>Remedial Track</span>
                    </div>
                    <div className="rule-item">
                        <span>Score &gt; 85%</span>
                        <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>Fast Track</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, sub }) => (
    <div className="card stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <h4>{label}</h4>
            <div className="value">{value}</div>
            <p className="sub">{sub}</p>
        </div>
    </div>
);

export default AdminDashboard;
