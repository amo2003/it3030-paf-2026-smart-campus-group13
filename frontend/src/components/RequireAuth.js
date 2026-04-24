import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './RequireAuth.css';

export default function RequireAuth({ children }) {
  const user = localStorage.getItem('currentUser');
  const { pathname } = useLocation();

  if (user) return children;

  // Store where they were trying to go (optional UX improvement)
  const from = encodeURIComponent(pathname);

  return (
    <div className="auth-block-page">
      <div className="auth-block-card">

        <div className="auth-block-icon">🔒</div>

        <div className="auth-block-badge">
          🚫 Access Restricted
        </div>

        <h2>Login Required</h2>

        <p>
          You need to be signed in to access this page.
          Please log in with your Google account to continue.
        </p>

        <Link to={`/login?from=${from}`} className="auth-block-btn">
          Sign in with Google →
        </Link>

        <Link to="/" className="auth-block-home">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}
