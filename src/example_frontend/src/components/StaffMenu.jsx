import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaListAlt, FaPlus, FaClipboardList, FaUserCircle } from 'react-icons/fa';

function StaffMenu({ onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <FaUserCircle className="me-2" /> Besa Platform
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link rounded-pill px-3" to="/dashboard">
                <FaHome className="me-1" /> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link rounded-pill px-3" to="/house-list">
                <FaListAlt className="me-1" /> House List
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link rounded-pill px-3" to="/newhouse">
                <FaPlus className="me-1" /> New House
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link rounded-pill px-3" to="/allbookings">
                <FaClipboardList className="me-1" /> Bookings
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="navbar-text me-3 text-white">Welcome, admin</span>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-danger rounded-pill text-white px-3" onClick={onLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default StaffMenu;
