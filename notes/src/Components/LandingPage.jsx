// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'
import Button from 'react-bootstrap/Button';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <h1 className="landing-page-title">Welcome to Our Note-Taking App</h1>
      <div className="landing-page-buttons">
        <Link to="/register" className="landing-page-link">
          <Button variant="primary" className="note-btn update-note-btn">Register</Button>
        </Link>
        <span className="landing-page-button-spacer"></span> {/* Spacer element */}
        <Link to="/login" className="landing-page-link">
          <Button variant="secondary" className="note-btn view-note-btn">Login</Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
