import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { example_backend } from 'declarations/example_backend';
import './index.scss';
import { BrowserRouter as Router, Route,  Routes, Link } from "react-router-dom";
import Home from './components/Home';
import Booking from './components/Booking';
import NewHouse from './components/NewHouse';
import MyHouses from './components/MyHouses';
import MyBookings from './components/MyBookings';
import Swal from 'sweetalert2/src/sweetalert2.js'



function App() {

  const canisterId = process.env.CANISTER_ID_EXAMPLE_FRONTEND;

  return (
   
  <>
     <Router>
      <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/booking/:houseId" element={<Booking />} />
          <Route exact path="/newhouse" element={<NewHouse />} />
          <Route exact path="/myhouses" element={<MyHouses />} />
          <Route exact path="/mybookings" element={<MyBookings />} />
          
      </Routes>
      
    </Router>
    
    
    </>
  );
  
}

export default App;

