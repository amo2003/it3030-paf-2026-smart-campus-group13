import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="m3-navbar">
      <div className="m3-navbar-inner">
        <div className="m3-navbar-brand">
          <h2>🎫 Maintenance Ticketing</h2>
          <span>Module 3</span>
        </div>
        <div className="m3-nav-links">
          <Link to="/tickets" className="m3-nav-link">Dashboard</Link>
          *<Link to="/tickets/create" className="m3-nav-link primary">+ Create Ticket</Link>*
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
