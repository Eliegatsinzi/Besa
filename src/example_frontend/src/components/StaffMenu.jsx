import React from 'react';
import { Link } from 'react-router-dom';

function StaffMenu() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-secondary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">Besa Platform</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/house-list">House List</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/newhouse">New House</Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="navbar-text me-3 btn btn-default">Welcome, admin</span>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-danger" to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default StaffMenu;
