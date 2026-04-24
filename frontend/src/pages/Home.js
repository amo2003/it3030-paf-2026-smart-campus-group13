import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: '📅',
    title: 'Easy Booking',
    desc: 'Reserve lecture halls, labs, and meeting rooms within seconds using our streamlined booking flow.',
  },
  {
    icon: '✅',
    title: 'Approval Workflow',
    desc: 'All bookings pass through an intelligent approval process for better resource management.',
  },
  {
    icon: '📧',
    title: 'Smart Notifications',
    desc: 'Receive instant email alerts when bookings are approved, rejected, or updated.',
  },
  {
    icon: '📊',
    title: 'Live Tracking',
    desc: 'Track booking status and monitor activity with real-time updates and analytics.',
  },
];

const stats = [
  { value: '10K+', label: 'Bookings Managed' },
  { value: '250+', label: 'Campus Resources' },
  { value: '99.9%', label: 'System Reliability' },
  { value: '24/7', label: 'Availability' },
];

function Home() {
  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-bg-glow hero-glow-1"></div>
        <div className="hero-bg-glow hero-glow-2"></div>

        <div className="hero-content">

          <div className="hero-badge">
            🚀 Smart Digital Campus Platform
          </div>

          <h1>
            Next Generation
            <span> Campus Booking </span>
            Experience
          </h1>

          <p>
            Simplify university resource reservations with a powerful,
            intelligent, and beautifully designed booking management system.
          </p>

          <div className="hero-buttons">
            <Link to="/reslist" className="hero-btn primary-btn">
              Book Resource
            </Link>

            <Link to="/tickets/create" className="hero-btn secondary-btn">
              Complain Issues 
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat-card">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="features-section">

        <div className="section-header">
          <span>POWERFUL FEATURES</span>
          <h2>Everything You Need</h2>
          <p>
            Designed for modern campuses with speed,
            transparency, and user experience in mind.
          </p>
        </div>

        <div className="features-grid">

          {features.map((feature) => (
            <div key={feature.title} className="feature-card">

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.desc}</p>

              <div className="feature-line"></div>

            </div>
          ))}

        </div>

      </section>

      {/* CAMPUS GALLERY — pure image section, no navigation */}
      <section className="gallery-section">
        <div className="gallery-container">

          <div className="section-header">
            <span>OUR CAMPUS</span>
            <h2>Campus Life</h2>
            <p>A glimpse of the spaces and facilities you can book and explore.</p>
          </div>

          <div className="gallery-grid">
            {/*  Replace each src with your own image paths */}
            {/* Place images in frontend/public/images/ folder */}

            <div className="gallery-item gallery-large">
              <img src="/images/l1.jpg" alt="Campus" />
              <div className="gallery-caption">Main Campus</div>
            </div>

            <div className="gallery-item">
              <img src="/images/l2.jpg" alt="Lecture Hall" />
              <div className="gallery-caption">Lecture Halls</div>
            </div>

            <div className="gallery-item">
              <img src="/images/l3.jpg" alt="Labs" />
              <div className="gallery-caption">Computer Labs</div>
            </div>

            <div className="gallery-item">
              <img src="/images/l6.jpg" alt="Meeting Rooms" />
              <div className="gallery-caption">Meeting Rooms</div>
            </div>

            <div className="gallery-item gallery-wide">
              <img src="/images/l4.jpg" alt="Campus Grounds" />
              <div className="gallery-caption">Campus Grounds</div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">

        <div className="cta-card">

          <h2>
            Ready to Transform
            Your Campus Experience?
          </h2>

          <p>
            Start booking smarter and managing resources more efficiently.
          </p>

          <Link to="/reslist" className="cta-button">
            Start Booking Now
          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Smart Campus Booking System.
          All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default Home;