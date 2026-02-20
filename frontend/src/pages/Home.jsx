import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Rocket, Target, BarChart3, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
    return (
        <div className="home-container animate-slide-up">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="badge">AI-Powered Learning</div>
                    <h1>Master Your Future with <span className="gradient-text">ALME</span></h1>
                    <p className="hero-subtitle">
                        Experience the next generation of Learning Management. Our Autonomous Ecosystem uses AI to personalize your path, track your growth, and accelerate your success.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary">
                            Get Started Free <Rocket size={20} />
                        </Link>
                        <Link to="/login" className="btn btn-outline">
                            Sign In <ArrowRight size={20} />
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-num">95%</span>
                            <span className="stat-desc">Success Rate</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-num">500k+</span>
                            <span className="stat-desc">Learners</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-num">1.2k+</span>
                            <span className="stat-desc">Courses</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="visual-circle main"></div>
                    <div className="visual-circle secondary"></div>
                    <div className="visual-card floating-1">
                        <Target color="var(--accent)" size={24} />
                        <span>Skill Target Achieved</span>
                    </div>
                    <div className="visual-card floating-2">
                        <BarChart3 color="var(--primary)" size={24} />
                        <span>+12% Progress This Week</span>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Why Choose ALME?</h2>
                    <p>Everything you need to master new skills in the digital age.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                            <BrainCircuit size={32} />
                        </div>
                        <h3>AI Personalization</h3>
                        <p>Our algorithm adapts to your learning style, recommending content that matches your unique pace and goals.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--secondary)' }}>
                            <BarChart3 size={32} />
                        </div>
                        <h3>Deep Analytics</h3>
                        <p>Track every micro-step of your journey with comprehensive dashboards and predictive performance forecasting.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)' }}>
                            <Users size={32} />
                        </div>
                        <h3>Network Learning</h3>
                        <p>Connect with peers, share resources, and collaborate on projects within our global academic network.</p>
                    </div>
                </div>
            </section>

            {/* Social Proof / Trust */}
            <section className="trust-section">
                <div className="trust-content">
                    <div className="trust-text">
                        <h3>Built for the modern learner.</h3>
                        <ul className="trust-list">
                            <li><CheckCircle2 size={18} color="#10b981" /> Curated By Industry Experts</li>
                            <li><CheckCircle2 size={18} color="#10b981" /> 24/7 AI Troubleshooting</li>
                            <li><CheckCircle2 size={18} color="#10b981" /> Recognized Certifications</li>
                        </ul>
                    </div>
                    <div className="trust-cta">
                        <Link to="/register" className="btn btn-primary full-width">Join the Community</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
