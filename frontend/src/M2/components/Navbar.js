import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addLocalNotification } from '../../M4/services/localNotifications';
import './Navbar.css';

// ── Default (not logged in) ──────────────────────────────
const guestLinks = [];

// ── Regular user links ───────────────────────────────────
const userLinks = [
  { to: '/',            label: '🏠 Home'        },
  { to: '/reslist',     label: 'New Booking' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/tickets/my',  label: 'My Tickets'  },
];

// ── Admin-only links ─────────────────────────────────────
const adminLinks = [
  { to: '/',            label: '🏠 Home'            },
  { to: '/admind',      label: 'Dashboard'       },
  { to: '/analytics',   label: 'Analytics'       },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    setUser(stored ? JSON.parse(stored) : null);
  }, [pathname]);

  const handleLogout = () => {
    const name = user?.name || 'User';
    addLocalNotification('LOGOUT', 'Signed Out', `${name} signed out at ${new Date().toLocaleTimeString()}`);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('myTicketsName');
    sessionStorage.clear();
    setUser(null);
    navigate('/');
  };

  const isAdmin = user?.role === 'ADMIN';
  const links   = user ? (isAdmin ? adminLinks : userLinks) : guestLinks;
  const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">🏫 Smart Campus</Link>

        {/* Desktop links */}
        <div className="navbar-desktop">

          {/* ── Not logged in ── */}
          {!user && (
            <>
              <Link to="/" className={`nav-link${pathname === '/' ? ' active' : ''}`}>Home</Link>
              <div className="nav-divider" />
              <Link to="/login" className="nav-login-outline">Login</Link>
              <Link to="/login" className="nav-login-btn">Get Started</Link>
            </>
          )}

          {/* ── Logged in (user or admin) ── */}
          {user && (
            <>
              {links.map(l => (
                <Link key={l.to + l.label} to={l.to}
                  className={`nav-link${pathname === l.to ? ' active' : ''}`}>
                  {l.label}
                </Link>
              ))}

              <div className="nav-divider" />

              {/* Profile chip */}
              <Link to="/profile" className="nav-profile-chip">
                <div className={`nav-avatar${isAdmin ? ' admin' : ''}`}>{initials}</div>
                <span className="nav-user-name">{user.name?.split(' ')[0]}</span>
                {isAdmin && <span className="nav-admin-badge">Admin</span>}
              </Link>

              <button onClick={handleLogout} className="nav-logout">Logout</button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="navbar-mobile">
          {!user && (
            <>
              <Link to="/"      onClick={() => setOpen(false)} className="nav-link">Home</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="nav-link">Login</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="nav-link" style={{ color: '#4f46e5', fontWeight: 700 }}>Get Started</Link>
            </>
          )}

          {user && (
            <>
              {/* User info row */}
              <div className="navbar-mobile-user">
                <div className={`nav-avatar${isAdmin ? ' admin' : ''}`}>{initials}</div>
                <div>
                  <span className="nav-user-name">{user.name}</span>
                  {isAdmin && <span className="nav-admin-badge" style={{ marginLeft: 6 }}>Admin</span>}
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{user.email}</div>
                </div>
              </div>

              {/* Role label */}
              <div className={`mobile-role-banner${isAdmin ? ' admin' : ' user'}`}>
                {isAdmin ? '⚙️ Administrator Menu' : '👤 User Menu'}
              </div>

              {links.map(l => (
                <Link key={l.to + l.label} to={l.to} onClick={() => setOpen(false)}
                  className={`nav-link${pathname === l.to ? ' active' : ''}`}>
                  {l.label}
                </Link>
              ))}

              <div style={{ height: 1, background: '#f1f5f9', margin: '8px 0' }} />
              <Link to="/profile"       onClick={() => setOpen(false)} className="nav-link">👤 Profile</Link>
              <Link to="/notifications" onClick={() => setOpen(false)} className="nav-link">🔔 Notifications</Link>
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="nav-logout"
                style={{ textAlign: 'left', marginTop: 4 }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
