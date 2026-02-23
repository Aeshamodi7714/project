import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Sun, Moon, Bell, Search, User, BrainCircuit, LayoutDashboard, BookOpen, Book, Network as NetworkIcon, FileQuestion, LogOut, ShieldCheck } from 'lucide-react';

const Header = ({ theme, toggleTheme, onLogout, isAuthenticated }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleNewNotification = (e) => {
      console.log("Header received notification:", e.detail.message);
      const newNotif = {
        id: Date.now(),
        message: e.detail.message,
        time: 'Just now',
        unread: true
      };
      setNotifications(prev => {
        const updated = [newNotif, ...prev].slice(0, 10);
        console.log("Updated notification state:", updated);
        return updated;
      });
    };

    window.addEventListener('new-notification', handleNewNotification);
    return () => window.removeEventListener('new-notification', handleNewNotification);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const API_BASE = `http://${window.location.hostname}:5000`;
        const response = await fetch(`${API_BASE}/api/search?q=${searchQuery}`);
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery('');
    if (result.type === 'skill') {
      navigate('/courses');
    } else {
      navigate('/quizzes');
    }
  };

  const handleNavClick = (e, target) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert('Login first to access this feature');
      navigate('/login');
    }
  };

  return (
    <header className="header glass">
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div className="logo-container" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0, cursor: 'pointer' }}>
          <div className="logo-orb" style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BrainCircuit size={20} color="white" />
          </div>
          <span className="logo-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>ALME</span>
        </div>

        <nav className="top-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!isAuthenticated ? (
            <>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <LayoutDashboard size={18} />
                <span>Home</span>
              </NavLink>
              <NavLink to="/login" className="nav-item" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <ShieldCheck size={18} />
                <span>Login</span>
              </NavLink>
              <NavLink to="/register" className="nav-item" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <User size={18} />
                <span>Register</span>
              </NavLink>
            </>
          ) : user?.role === 'admin' ? (
            <NavLink to="/admin" onClick={(e) => handleNavClick(e, '/admin')} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
              <ShieldCheck size={18} />
              <span>Admin Control Center</span>
            </NavLink>
          ) : (
            <>
              <NavLink to="/student" onClick={(e) => handleNavClick(e, '/student')} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/courses" onClick={(e) => handleNavClick(e, '/courses')} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <BookOpen size={18} />
                <span>Courses</span>
              </NavLink>
              <NavLink to="/books" onClick={(e) => handleNavClick(e, '/books')} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <Book size={18} />
                <span>Books</span>
              </NavLink>
              <NavLink to="/network" onClick={(e) => handleNavClick(e, '/network')} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <NetworkIcon size={18} />
                <span>Network</span>
              </NavLink>
              <NavLink to="/quizzes" onClick={(e) => handleNavClick(e, '/quizzes')} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <FileQuestion size={18} />
                <span>Quizzes</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {isAuthenticated && user?.role !== 'admin' && (
          <div className="search-wrapper" style={{ position: 'relative' }}>
            <div className="search-bar" style={{ width: '300px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', width: '100%', fontSize: '0.85rem' }}
              />
              {isSearching && <div className="spinner-mini" style={{ width: '12px', height: '12px', border: '2px solid var(--text-muted)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>}
            </div>

            {showResults && results.length > 0 && (
              <div className="search-results-dropdown glass" style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', boxShadow: 'var(--shadow)', zIndex: 2000, padding: '0.5rem', overflow: 'hidden' }}>
                {results.map((res) => (
                  <div
                    key={`${res.type}-${res.id}`}
                    onClick={() => handleResultClick(res)}
                    className="search-result-item"
                    style={{ padding: '0.75rem 1rem', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                  >
                    <div className="res-icon" style={{ color: res.type === 'skill' ? 'var(--primary)' : 'var(--accent)' }}>
                      {res.type === 'skill' ? <BookOpen size={16} /> : <FileQuestion size={16} />}
                    </div>
                    <div className="res-info">
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{res.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{res.info}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="actions-group" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', position: 'relative' }}>
          <button onClick={toggleTheme} className="theme-toggle" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {isAuthenticated && user?.role !== 'admin' && (
            <div className="notification-bell-container" style={{ position: 'relative' }}>
              <div
                className="notification-bell"
                onClick={() => { setShowNotifications(!showNotifications); markAllAsRead(); }}
                style={{ cursor: 'pointer', color: showNotifications ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.5rem', transition: 'all 0.2s' }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '4px', right: '4px',
                    background: '#ef4444', color: 'white',
                    fontSize: '10px', padding: '2px 6px', borderRadius: '50%',
                    fontWeight: 900, border: '2px solid var(--surface)',
                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: '18px', height: '18px'
                  }}>{unreadCount}</span>
                )}
              </div>

              {showNotifications && (
                <div className="notifications-dropdown glass animate-slide-up" style={{
                  position: 'absolute', top: '100%', right: '0', width: '300px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '16px', marginTop: '12px', zIndex: 3000,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)', padding: '1.2rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h5 style={{ margin: 0, fontWeight: 800 }}>Notifications</h5>
                    <button onClick={clearNotifications} style={{ fontSize: '0.7rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}>Clear All</button>
                  </div>

                  <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} style={{ padding: '0.8rem', borderRadius: '12px', background: n.unread ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                        <div style={{ marginBottom: '0.3rem', fontWeight: 500 }}>{n.message}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</div>
                      </div>
                    )) : (
                      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No notifications yet</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div
            className="user-profile-header"
            onClick={() => navigate('/profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              paddingLeft: '1rem',
              borderLeft: '1px solid var(--border)',
              height: '40px',
              cursor: 'pointer'
            }}
          >
            <div className="user-info" style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
              <div className="user-name" style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>{user?.name || 'Academic'}</div>
              <div className="user-role" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role || 'Learner'}</div>
            </div>
            <div className="avatar" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' }}>
              {user?.name?.charAt(0) || <User size={18} />}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
