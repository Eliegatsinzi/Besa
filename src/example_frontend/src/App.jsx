import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Booking from './components/Booking';
import NewHouse from './components/NewHouse';
import MyHouses from './components/MyHouses';
import MyBookings from './components/MyBookings';
import Login from './components/Login';
import StaffMenu from './components/StaffMenu';
import StaffDashboard from './components/StaffDashboard';
import HouseListHolder from './components/HouseListHolder';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
  };

  return (
    <Router>
      {user && (user.role === 'admin' || user.role === 'staff') && <StaffMenu />} {/* Show StaffMenu if user is logged in as admin or staff */}
      <Routes>
        {/* Routes available to all users, including non-logged-in users */}
        <Route exact path="/" element={<Home />} />
        <Route exact path="/booking/:houseId" element={<Booking />} />
        <Route exact path="/newhouse" element={<NewHouse />} />
        <Route exact path="/myhouses" element={<MyHouses />} />
        <Route exact path="/mybookings" element={<MyBookings />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/staffaccess" element={<Navigate to="/login" />} />

        {/* Routes available only to logged-in users */}
        {user && (
          <>
            {user.role === 'admin' && (
              <>
                <Route path="/dashboard" element={<StaffDashboard />} />
                <Route path="/house-list" element={<HouseListHolder />} />
                {/* Add other admin-specific routes */}
              </>
            )}

            {/* {user.role === 'staff' && (
              <>
                <Route path="/dashboard" element={<StaffDashboard />} />
                <Route path="/house-list" element={<HouseListHolder />} />
              </>
            )} */ }
          </>
        )}

        {/* Fallback route for unauthorized access */}
        <Route
          path="*"
          element={<div className="container mt-5"><h2 className="text-center">404 - Page Not Found</h2></div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
