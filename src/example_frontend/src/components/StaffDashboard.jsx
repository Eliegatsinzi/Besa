import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaListAlt, FaClipboardList, FaChartBar } from 'react-icons/fa';

function StaffDashboard() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 animated-title">Staff Dashboard</h2>
      <div className="row text-center">
        <div className="col-md-6 mb-4 animated-card">
          <div className="card shadow-sm card-hover">
            <div className="card-body">
              <FaHome className="dashboard-icon mb-3" />
              <h5 className="card-title">Add New House</h5>
              <p className="card-text">Easily add a new house to the platform.</p>
              <Link to="/newhouse" className="btn btn-primary rounded-pill">Add House</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4 animated-card">
          <div className="card shadow-sm card-hover">
            <div className="card-body">
              <FaListAlt className="dashboard-icon mb-3" />
              <h5 className="card-title">View & Manage Houses</h5>
              <p className="card-text">View, edit, and manage all houses on the platform.</p>
              <Link to="/house-list" className="btn btn-primary rounded-pill">Manage Houses</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4 animated-card">
          <div className="card shadow-sm card-hover">
            <div className="card-body">
              <FaClipboardList className="dashboard-icon mb-3" />
              <h5 className="card-title">Bookings</h5>
              <p className="card-text">Manage all bookings made by users.</p>
              <Link to="/allbookings" className="btn btn-primary rounded-pill">View Bookings</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4 animated-card">
          <div className="card shadow-sm card-hover">
            <div className="card-body">
              <FaChartBar className="dashboard-icon mb-3" />
              <h5 className="card-title">Analytics</h5>
              <p className="card-text">View analytics and track performance.</p>
              <Link to="/analytics" className="btn btn-primary rounded-pill">View Analytics</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
