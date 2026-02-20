import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Twitter, Github, Linkedin, Mail, ArrowRight, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="main-footer glass">
            <div className="footer-content">
                {/* Branding Column */}
                <div className="footer-column branding">
                    <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <div className="logo-orb" style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BrainCircuit size={18} color="white" />
                        </div>
                        <span className="logo-text" style={{ fontSize: '1.1rem', fontWeight: 800 }}>ALME</span>
                    </div>
                    <p className="footer-bio">
                        Revolutionizing the academic landscape with AI-driven personalized learning paths and deep data analytics.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-item"><Twitter size={18} /></a>
                        <a href="#" className="social-item"><Github size={18} /></a>
                        <a href="#" className="social-item"><Linkedin size={18} /></a>
                    </div>
                </div>

                {/* Links Column 1 */}
                <div className="footer-column">
                    <h4>Ecosystem</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Homepage</Link></li>
                        <li><Link to="/courses">Courses</Link></li>
                        <li><Link to="/quizzes">Assessment Lab</Link></li>
                        <li><Link to="/network">Academic Network</Link></li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div className="footer-column">
                    <h4>Support</h4>
                    <ul className="footer-links">
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Use</a></li>
                    </ul>
                </div>

                {/* Newsletter Column */}
                <div className="footer-column newsletter">
                    <h4>Stay Updated</h4>
                    <p>Join our newsletter for the latest AI insights.</p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Email address" className="glass-input" />
                        <button className="btn-icon">
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="copyright">
                    © 2026 ALME Ecosystem. All rights reserved.
                </div>
                <div className="made-with">
                    Made with <Heart size={14} color="var(--accent)" fill="var(--accent)" /> for the future of education
                </div>
            </div>
        </footer>
    );
};

export default Footer;
