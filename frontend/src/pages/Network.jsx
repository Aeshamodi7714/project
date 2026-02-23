import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, ShieldCheck, Heart, Share2, Search, Send, BrainCircuit, CheckCircle2, MoreHorizontal, X, Bot, Sparkles } from 'lucide-react';

const Network = () => {
    const [posts, setPosts] = useState([]);
    const [circles, setCircles] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [showAllCircles, setShowAllCircles] = useState(false);
    const [joinedCircles, setJoinedCircles] = useState([]);
    const [message, setMessage] = useState(null);
    const [selectedCircle, setSelectedCircle] = useState(null);
    const [circleReplies, setCircleReplies] = useState([]);

    // Dynamic API Base to handle both localhost and 127.0.0.1 issues on Windows
    const API_BASE = `http://${window.location.hostname}:5000`;
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'mock_id', name: 'Academic', role: 'Student' };

    const fetchData = async () => {
        try {
            console.log(`Checking connectivity to ${API_BASE}/api/health...`);
            const [postsRes, circlesRes] = await Promise.all([
                fetch(`${API_BASE}/api/posts`),
                fetch(`${API_BASE}/api/circles`)
            ]);
            const postsData = await postsRes.json();
            const circlesData = await circlesRes.json();
            setPosts(postsData);
            setCircles(circlesData);
            console.log(`Fetched ${postsData.length} posts and ${circlesData.length} circles.`);

            // Fetch user's joined circles from dashboard endpoint
            const dashUrl = user.id !== 'mock_id'
                ? `${API_BASE}/api/student/${user.id}/dashboard`
                : `${API_BASE}/api/student/dashboard/mock`;

            const dashRes = await fetch(dashUrl);
            const dashData = await dashRes.json();
            setJoinedCircles(dashData.joinedCircles || []);
        } catch (err) {
            console.error('Network Fetch error:', err);
            // Fallback strategy: try hardcoded 127.0.0.1 if dynamic hostname fails
            if (!API_BASE.includes('127.0.0.1')) {
                console.log("Retrying with 127.0.0.1...");
                try {
                    const res = await fetch('http://127.0.0.1:5000/api/circles');
                    const data = await res.json();
                    setCircles(data);
                } catch (inner) { console.error("All connection attempts failed."); }
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePost = async () => {
        if (!newPostContent.trim()) return;
        setIsPosting(true);
        try {
            console.log(`Attempting to post to ${API_BASE}/api/posts:`, newPostContent);
            const res = await fetch(`${API_BASE}/api/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: user.name,
                    role: user.role === 'admin' ? 'Strategic Admin' : 'Academic Researcher',
                    avatar: user.name.charAt(0).toUpperCase(),
                    content: newPostContent,
                    topic: "#Innovation",
                    color: "var(--primary)"
                })
            });
            if (res.ok) {
                const data = await res.json();
                console.log("Post successful:", data);
                setNewPostContent('');
                fetchData();
                showTemporaryMessage("Post successfully broadcasted to the network!");
            } else {
                const errorData = await res.json();
                console.error("Post failed server-side:", errorData);
                showTemporaryMessage("Failed to post: " + (errorData.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Post fetch error:", err);
            showTemporaryMessage(`Network error while posting to ${API_BASE}. Please check if backend is running on port 5000.`);
        } finally {
            setIsPosting(false);
        }
    };

    const handleJoinCircle = async (circleName) => {
        if (user.id === 'mock_id') {
            showTemporaryMessage("Please log in to join study circles!");
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/users/${user.id}/circles/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ circleName })
            });
            if (res.ok) {
                const data = await res.json();
                setJoinedCircles(data.joinedCircles);

                console.log(`Dispatching notification for: ${circleName}`);
                // Dispatch global notification for Header
                const event = new CustomEvent('new-notification', {
                    detail: { message: `Successfully subscribed to ${circleName}!` }
                });
                window.dispatchEvent(event);

                showTemporaryMessage(`Success! You have officially joined the ${circleName} circle!`);
                fetchData(); // Refresh member counts
            } else {
                const errorData = await res.json();
                showTemporaryMessage("Error: " + (errorData.error || "Failed to join circle"));
            }
        } catch (err) {
            console.error("Join Circle Error:", err);
            showTemporaryMessage("Network error. Please try again.");
        }
    };

    const showTemporaryMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 4000);
    };

    const displayedCircles = showAllCircles ? circles : circles.slice(0, 3);

    return (
        <div className="network-wrapper animate-slide-up">
            {message && (
                <div className="status-toast glass animate-slide-down">
                    <CheckCircle2 size={20} color="var(--primary)" />
                    <span>{message}</span>
                </div>
            )}

            <header className="page-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Ecosystem Network <span className="gradient-text">Connect</span></h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Collaborate with global researchers in your specialized track.</p>
                </div>
                <div className="search-bar-modern glass">
                    <Search size={20} color="var(--text-muted)" />
                    <input type="text" placeholder="Search researchers, topics..." />
                </div>
            </header>

            <div className="network-layout">
                <main className="feed-container">
                    <div className="card share-card shadow-lg">
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div className="avatar user-avatar">{user.name.charAt(0)}</div>
                            <div style={{ flex: 1 }}>
                                <textarea
                                    placeholder="Share your latest research breakthrough..."
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                />
                                <div className="share-actions">
                                    <div className="input-metadata">
                                        <BrainCircuit size={16} /> Exploring Neural Logic
                                    </div>
                                    <button
                                        className="auth-btn ripple"
                                        onClick={handlePost}
                                        disabled={isPosting || !newPostContent.trim()}
                                        style={{ width: 'auto', padding: '0.7rem 2.5rem', marginTop: 0 }}
                                    >
                                        {isPosting ? 'Posting...' : 'Post Network Update'} <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="feed-list">
                        <div className="section-title-wrap">
                            <h3 className="section-title">Network Activity</h3>
                            <div className="live-indicator"><span className="dot"></span> LIVE</div>
                        </div>
                        {posts.length > 0 ? posts.map(post => (
                            <div key={post._id} className="card post-card glass-hover animate-fade-in">
                                <div className="post-header">
                                    <div className="post-user-info">
                                        <div className="avatar" style={{ background: post.color || 'var(--primary)' }}>{post.avatar}</div>
                                        <div>
                                            <p className="user-name">{post.user}</p>
                                            <p className="user-role-text">{post.role} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="post-meta-tags">
                                        <span className="topic-tag" style={{ border: `1px solid ${post.color || 'var(--primary)'}40`, color: post.color || 'var(--primary)' }}>{post.topic || '#Research'}</span>
                                        <button className="more-btn"><MoreHorizontal size={18} /></button>
                                    </div>
                                </div>

                                <p className="post-text-content">{post.content}</p>

                                {/* AI Auto-Reply Section */}
                                {post.aiReply && (
                                    <div className="ai-reply-section animate-fade-in">
                                        <div className="ai-reply-header">
                                            <div className="ai-reply-badge">
                                                <Bot size={14} />
                                                <span>ALME AI</span>
                                                <Sparkles size={12} />
                                            </div>
                                        </div>
                                        <p className="ai-reply-text">{post.aiReply}</p>
                                    </div>
                                )}

                                <div className="post-footer">
                                    <button className="post-interaction"><Heart size={18} /> {post.likes}</button>
                                    <button className="post-interaction"><MessageSquare size={18} /> {post.comments}</button>
                                    <button className="post-interaction"><Share2 size={18} /></button>
                                </div>
                            </div>
                        )) : (
                            <div className="empty-feed-container animate-fade-in">
                                <div className="empty-feed glass shadow-lg">
                                    <div className="empty-icon-pulse">
                                        <MessageSquare size={48} className="text-muted" />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '1rem 0' }}>Silence is the beginning of innovation.</h3>
                                    <p className="text-muted">No network updates yet. Why not join a study circle and start a discussion?</p>
                                </div>

                                <div className="empty-state-suggestions" style={{ marginTop: '3rem' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <BrainCircuit size={18} color="var(--primary)" /> Recommended Circles for You
                                    </h4>
                                    <div className="suggestion-grid">
                                        {(circles.filter(c => c.suggested).length > 0
                                            ? circles.filter(c => c.suggested)
                                            : circles
                                        ).slice(0, 2).map(circle => (
                                            <div key={circle._id} className="suggestion-card glass animate-slide-up">
                                                <div className="suggestion-card-content">
                                                    <div className="circle-glyph" style={{ background: 'var(--primary)', color: 'white' }}>
                                                        {circle.icon === 'ShieldCheck' ? <ShieldCheck size={20} /> : <Users size={20} />}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <h5 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>{circle.name}</h5>
                                                        <p className="text-muted text-sm" style={{ margin: '0.2rem 0 0.8rem' }}>{circle.members} researchers already subscribed</p>
                                                        {joinedCircles.includes(circle.name) ? (
                                                            <div className="joined-label-sm"><CheckCircle2 size={14} /> Subscribed</div>
                                                        ) : (
                                                            <button className="subscribe-btn-sm ripple" onClick={() => handleJoinCircle(circle.name)}>Subscribe Now</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {circles.length === 0 && (
                                        <div className="text-muted" style={{ padding: '2rem', border: '1px dashed var(--border)', borderRadius: '16px', textAlign: 'center' }}>
                                            Loading latest circle suggestions...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <aside className="network-sidebar">
                    <div className="sidebar-card card glass sticky-sidebar">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Study Circles</h3>
                            <span className="badge-sm">{circles.length} Active</span>
                        </div>

                        <div className="study-circles-stack">
                            {displayedCircles.map(circle => (
                                <div
                                    key={circle._id}
                                    className={`circle-nexus-item ${joinedCircles.includes(circle.name) ? 'circle-subscribed-clickable' : ''}`}
                                    onClick={() => joinedCircles.includes(circle.name) && setSelectedCircle(circle)}
                                    title={joinedCircles.includes(circle.name) ? 'Click to view circle details' : ''}
                                >
                                    <div className="circle-main-info">
                                        <div className="circle-lead">
                                            <div className="circle-glyph">
                                                {circle.icon === 'ShieldCheck' ? <ShieldCheck size={18} /> : <Users size={18} />}
                                            </div>
                                            <div className="circle-details">
                                                <h4 className="circle-title">{circle.name}</h4>
                                                <p className="circle-stats">{circle.members} Collaborators</p>
                                            </div>
                                        </div>
                                        {joinedCircles.includes(circle.name) ? (
                                            <div className="joined-label"><CheckCircle2 size={14} /> Subscribed</div>
                                        ) : (
                                            <button className="subscribe-btn" onClick={(e) => { e.stopPropagation(); handleJoinCircle(circle.name); }}>Subscribe</button>
                                        )}
                                    </div>

                                    {/* Preview Content for non-joined circles */}
                                    {!joinedCircles.includes(circle.name) && (
                                        <div className="circle-preview-lock">
                                            <div className="blurred-line"></div>
                                            <div className="blurred-line short"></div>
                                            <span className="lock-text">Subscribe to unlock circle content</span>
                                        </div>
                                    )}

                                    {joinedCircles.includes(circle.name) && (
                                        <div className="circle-activity-unlocked animate-fade-in">
                                            <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, marginTop: '0.5rem' }}>
                                                Latest: "New research paper on {circle.name.split(' ')[0]} logic published..."
                                            </p>
                                            <p className="circle-click-hint">Tap to view full details →</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {!showAllCircles && circles.length > 3 && (
                            <button className="explore-circles-btn" onClick={() => setShowAllCircles(true)}>
                                Explore All Circles <Search size={14} />
                            </button>
                        )}
                        {showAllCircles && (
                            <button className="explore-circles-btn" onClick={() => setShowAllCircles(false)}>
                                Show Recommended
                            </button>
                        )}
                    </div>
                </aside>
            </div>

            {/* ===== CIRCLE DETAIL MODAL ===== */}
            {selectedCircle && (
                <div className="circle-modal-backdrop animate-fade-in" onClick={() => setSelectedCircle(null)}>
                    <div className="circle-modal glass" onClick={e => e.stopPropagation()}>
                        <button className="circle-modal-close" onClick={() => setSelectedCircle(null)}>
                            <X size={20} />
                        </button>

                        {/* Header */}
                        <div className="circle-modal-header">
                            <div className="circle-modal-glyph">
                                {selectedCircle.icon === 'ShieldCheck' ? <ShieldCheck size={32} /> : <Users size={32} />}
                            </div>
                            <div>
                                <div className="circle-modal-subscribed-tag"><CheckCircle2 size={13} /> Subscribed</div>
                                <h2 className="circle-modal-title">{selectedCircle.name}</h2>
                                <p className="circle-modal-sub">{selectedCircle.members} Active Collaborators</p>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="circle-modal-stats">
                            <div className="circle-stat-box">
                                <span className="cstat-value">{selectedCircle.members}</span>
                                <span className="cstat-label">Members</span>
                            </div>
                            <div className="circle-stat-box">
                                <span className="cstat-value">24</span>
                                <span className="cstat-label">Posts This Week</span>
                            </div>
                            <div className="circle-stat-box">
                                <span className="cstat-value">3</span>
                                <span className="cstat-label">New Today</span>
                            </div>
                        </div>

                        {/* About */}
                        <div className="circle-modal-section">
                            <h4 className="circle-section-heading">📌 About This Circle</h4>
                            <p className="circle-modal-desc">
                                {selectedCircle.name} is a collaborative research group focused on advancing knowledge in {selectedCircle.name.split(' ').slice(0, 2).join(' ')}. Members share papers, discuss breakthroughs, and collaborate on projects regularly.
                            </p>
                        </div>

                        {/* Latest Activity */}
                        <div className="circle-modal-section">
                            <h4 className="circle-section-heading">🔥 Latest Activity</h4>
                            <div className="circle-activity-feed">
                                <div className="circle-activity-item">
                                    <div className="activity-dot green"></div>
                                    <div>
                                        <p className="activity-text">New research paper on <strong>{selectedCircle.name.split(' ')[0]} logic</strong> published</p>
                                        <span className="activity-time">2 hours ago</span>
                                    </div>
                                </div>
                                <div className="circle-activity-item">
                                    <div className="activity-dot blue"></div>
                                    <div>
                                        <p className="activity-text">Weekly discussion thread is now <strong>live</strong></p>
                                        <span className="activity-time">5 hours ago</span>
                                    </div>
                                </div>
                                <div className="circle-activity-item">
                                    <div className="activity-dot purple"></div>
                                    <div>
                                        <p className="activity-text">3 new members joined the circle</p>
                                        <span className="activity-time">Yesterday</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hot Topics */}
                        <div className="circle-modal-section">
                            <h4 className="circle-section-heading">💬 Hot Discussion Topics</h4>
                            <div className="circle-topics">
                                {['Advanced Algorithms', 'System Design', 'Open Source Projects', 'Interview Prep', 'Research Papers'].map(topic => (
                                    <span key={topic} className="circle-topic-tag">#{topic.replace(/ /g, '')}</span>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="circle-modal-actions">
                            <button className="circle-primary-action" onClick={() => setSelectedCircle(null)}>
                                <MessageSquare size={16} /> Open Discussion
                            </button>
                            <button className="circle-leave-btn" onClick={() => {
                                setJoinedCircles(prev => prev.filter(n => n !== selectedCircle.name));
                                setSelectedCircle(null);
                                showTemporaryMessage(`You have left the ${selectedCircle.name} circle.`);
                            }}>
                                Leave Circle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .network-layout { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; }
                .status-toast {
                    position: fixed; top: 1.5rem; right: 1.5rem; padding: 1rem 2rem;
                    border-radius: 16px; background: var(--surface); border: 1px solid var(--primary);
                    display: flex; align-items: center; gap: 1rem; z-index: 10000;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-weight: 700;
                }
                .search-bar-modern {
                    display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1.5rem;
                    border-radius: 15px; width: 400px;
                }
                .search-bar-modern input { background: transparent; border: none; outline: none; color: white; width: 100%; }

                .share-card { padding: 2rem; border-radius: 24px; position: relative; margin-bottom: 3rem; }
                .user-avatar { width: 55px; height: 55px; background: var(--primary); border-radius: 16px; font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }
                textarea { width: 100%; min-height: 120px; background: transparent; border: none; outline: none; color: var(--text); font-size: 1.2rem; resize: none; }
                .share-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
                .input-metadata { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; font-weight: 600; }

                .section-title-wrap { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding: 0 1rem; }
                .section-title { font-size: 1.2rem; fontWeight: 800; }
                .live-indicator { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 800; color: #f43f5e; }
                .dot { width: 8px; height: 8px; background: #f43f5e; border-radius: 50%; display: inline-block; animation: pulse 1.5s infinite; }

                .post-card { padding: 2.2rem; border-radius: 24px; margin-bottom: 2rem; position: relative; }
                .post-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.8rem; }
                .post-user-info { display: flex; gap: 1rem; align-items: center; }
                .post-user-info .avatar { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: white; }
                .user-name { font-weight: 800; font-size: 1.1rem; margin-bottom: 0.2rem; }
                .user-role-text { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
                .topic-tag { padding: 5px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; }
                .post-text-content { font-size: 1.15rem; line-height: 1.8; margin-bottom: 2rem; }
                .post-footer { display: flex; gap: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
                .post-interaction:hover { color: var(--primary); }
                .post-interaction { display: flex; align-items: center; gap: 0.6rem; color: var(--text-muted); font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; }

                /* AI Reply Section */
                .ai-reply-section {
                    margin: 0 0 1.8rem 0; padding: 1.2rem 1.5rem;
                    background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.06));
                    border: 1px solid rgba(99,102,241,0.2);
                    border-radius: 16px; position: relative;
                    border-left: 3px solid var(--primary);
                }
                .ai-reply-header {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 0.7rem;
                }
                .ai-reply-badge {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15));
                    padding: 4px 12px; border-radius: 20px;
                    font-size: 0.72rem; font-weight: 800; color: #a78bfa;
                    letter-spacing: 0.5px; text-transform: uppercase;
                }
                .ai-reply-text {
                    font-size: 0.95rem; line-height: 1.75; color: rgba(255,255,255,0.85);
                    margin: 0;
                }


                .empty-feed { padding: 5rem 2rem; text-align: center; border-radius: 32px; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--text-muted); background: rgba(255,255,255,0.01); }
                .empty-icon-pulse { padding: 2rem; background: rgba(255,255,255,0.03); border-radius: 50%; margin-bottom: 1rem; animation: iconPulse 2s infinite; }
                
                .suggestion-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .suggestion-card { padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .suggestion-card:hover { transform: translateY(-5px); border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
                .suggestion-card-content { display: flex; gap: 1.2rem; align-items: flex-start; }
                
                .subscribe-btn-sm { padding: 0.6rem 1.2rem; border-radius: 12px; background: var(--primary); color: white; border: none; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; width: 100%; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2); }
                .subscribe-btn-sm:hover { transform: scale(1.02); background: var(--primary-hover); }
                .joined-label-sm { color: #10b981; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.3rem; padding: 0.5rem; background: rgba(16, 185, 129, 0.1); border-radius: 8px; justify-content: center; }

                .study-circles-stack { display: flex; flex-direction: column; gap: 1rem; }
                .circle-nexus-item {
                    padding: 1.25rem 1.5rem; border-radius: 20px; background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border); transition: all 0.3s ease;
                }
                .circle-nexus-item:hover { transform: translateX(5px); border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
                .circle-main-info { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
                .circle-lead { display: flex; gap: 1.25rem; align-items: center; }
                .circle-glyph { width: 45px; height: 45px; border-radius: 12px; background: rgba(99, 102, 241, 0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; }
                .circle-title { font-weight: 800; font-size: 1.05rem; margin-bottom: 0.2rem; }
                .circle-stats { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

                .subscribe-btn { padding: 0.75rem 1.5rem; border-radius: 12px; background: var(--primary); color: white; font-weight: 800; font-size: 0.85rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
                .subscribe-btn:hover { transform: scale(1.05); background: var(--primary-hover); box-shadow: 0 6px 15px rgba(99, 102, 241, 0.3); }

                .circle-preview-lock {
                    margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05);
                    position: relative; display: flex; flex-direction: column; gap: 0.5rem;
                }
                .blurred-line { height: 6px; background: var(--border); border-radius: 10px; filter: blur(3px); opacity: 0.3; }
                .blurred-line.short { width: 60%; }
                .lock-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); opacity: 0.8; letter-spacing: 0.5px; }

                .joined-label { color: #10b981; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.3rem; }
                .explore-circles-btn { margin-top: 2rem; width: 100%; height: 55px; border-radius: 15px; border: 1px dashed var(--border); color: var(--text-muted); font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.8rem; background: none; cursor: pointer; transition: all 0.2s; }
                .explore-circles-btn:hover { border-color: var(--primary); color: white; background: rgba(99, 102, 241, 0.05); }

                .badge-sm { font-size: 0.7rem; font-weight: 800; padding: 4px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; color: var(--primary); }

                .circle-subscribed-clickable { cursor: pointer; }
                .circle-subscribed-clickable:hover { border-color: #10b981 !important; background: rgba(16,185,129,0.06) !important; }
                .circle-click-hint { font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem; font-weight: 600; }

                /* Circle Detail Modal */
                .circle-modal-backdrop {
                    position: fixed; inset: 0; background: rgba(5,7,15,0.82);
                    backdrop-filter: blur(18px); z-index: 9999;
                    display: flex; align-items: center; justify-content: center; padding: 2rem;
                }
                .circle-modal {
                    width: 100%; max-width: 560px;
                    background: rgba(30, 41, 59, 0.75);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 28px; padding: 2.5rem;
                    position: relative;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.6);
                    display: flex; flex-direction: column; gap: 1.8rem;
                    max-height: 90vh; overflow-y: auto;
                }
                .circle-modal-close {
                    position: absolute; top: 1.2rem; right: 1.2rem;
                    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
                    width: 40px; height: 40px; border-radius: 10px; color: white;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s;
                }
                .circle-modal-close:hover { background: rgba(239,68,68,0.25); border-color: rgba(239,68,68,0.5); transform: rotate(90deg); }
                .circle-modal-header { display: flex; gap: 1.5rem; align-items: center; }
                .circle-modal-glyph {
                    width: 70px; height: 70px; border-radius: 18px;
                    background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05));
                    border: 1px solid rgba(99,102,241,0.3);
                    color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }
                .circle-modal-subscribed-tag { display: inline-flex; align-items: center; gap: 0.3rem; color: #10b981; font-size: 0.78rem; font-weight: 800; margin-bottom: 0.4rem; }
                .circle-modal-title { font-size: 1.7rem; font-weight: 900; margin-bottom: 0.3rem; line-height: 1.2; }
                .circle-modal-sub { color: var(--text-muted); font-size: 0.9rem; font-weight: 600; }
                .circle-modal-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
                .circle-stat-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.2rem; text-align: center; }
                .cstat-value { display: block; font-size: 1.6rem; font-weight: 900; color: var(--primary); }
                .cstat-label { font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
                .circle-modal-section { display: flex; flex-direction: column; gap: 0.8rem; }
                .circle-section-heading { font-size: 0.95rem; font-weight: 800; color: var(--text); }
                .circle-modal-desc { font-size: 0.95rem; color: var(--text-muted); line-height: 1.7; }
                .circle-activity-feed { display: flex; flex-direction: column; gap: 0.9rem; }
                .circle-activity-item { display: flex; gap: 1rem; align-items: flex-start; }
                .activity-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
                .activity-dot.green { background: #10b981; }
                .activity-dot.blue { background: #6366f1; }
                .activity-dot.purple { background: #a855f7; }
                .activity-text { font-size: 0.9rem; color: var(--text); line-height: 1.5; margin-bottom: 0.2rem; }
                .activity-time { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
                .circle-topics { display: flex; flex-wrap: wrap; gap: 0.6rem; }
                .circle-topic-tag { background: rgba(99,102,241,0.1); color: var(--primary); border: 1px solid rgba(99,102,241,0.2); padding: 0.4rem 0.9rem; border-radius: 100px; font-size: 0.78rem; font-weight: 700; }
                .circle-modal-actions { display: flex; gap: 1rem; padding-top: 0.5rem; }
                .circle-primary-action { flex: 1; background: var(--primary); color: white; border: none; padding: 1rem; border-radius: 14px; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: filter 0.2s; }
                .circle-primary-action:hover { filter: brightness(1.12); }
                .circle-leave-btn { padding: 1rem 1.5rem; border-radius: 14px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
                .circle-leave-btn:hover { background: rgba(239,68,68,0.2); border-color: #f87171; }

                @keyframes pulse { 0% { opacity: 0.4; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.4; transform: scale(0.9); } }

                @media (max-width: 1100px) {
                    .network-layout { grid-template-columns: 1fr; }
                    .network-sidebar { display: none; }
                }
            `}</style>
        </div>
    );
};

export default Network;
