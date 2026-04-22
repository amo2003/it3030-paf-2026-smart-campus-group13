import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Maintenance Ticketing</h2>
        <span>Module 3</span>
      </div>

      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/tickets/create">Create Ticket</Link>
      </div>
    </nav>
  );
}

export default Navbar;