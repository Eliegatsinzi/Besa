import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { example_backend } from 'declarations/example_backend';
import { BrowserRouter as Router, Route,  Routes, Link } from "react-router-dom";
import NavBar from './NavBar';
import Footer from './Footer';


function Home (){


    const [users, setUsers] = useState([]); 
    const [newUser, setNewUser] = useState({name:'', address: '', owner: '', description: ''});
  
    const [apartments, setApartments] = useState([]);
    const [apartment, setApartmentss] = useState({name: '', address: '', owner:'', phone: '', price: '', description:'', image: null});
    
    const [selectedApartment, setSelectedApartment] = useState(null);
 
  

    
    const getHouse = async () => {
      try {
        const houses = await example_backend.getHouse();
        
        setApartments(houses);
        
      } catch (error) {
        console.error("Failed to fetch Houses:", error);
      }
    };
    
  getHouse();
  
  
  const getUsers = async () => {
    try {
      const user = await example_backend.getUsers();
      
      setUsers(user);

      
    //   let availabe = 0;
    //   users.forEach( (user, index) => {
    //       if (user.hash == String(principal)) {
    //           availabe += 1;
    //       }
    //   });
    //   if (availabe == 0) {
    //       location.href = login;
    //   }
      
    } catch (error) {
      console.error("Failed to fetch Users: ", error);
    }
  };



    getUsers();

  
    // Select apartment for more info, and booking
  
    const canisterId = process.env.CANISTER_ID_EXAMPLE_FRONTEND;
    const selectApartment = (i) => {
        const booking = `/booking/${i}?canisterId=${canisterId}`;
        location.href = booking; 
    }
    const newhouse = `/newhouse?canisterId=${canisterId}`;


    return (
        
        <div>
  
              <NavBar/>
            
            <div className="container">
            
                <div className="row mt-3">
                    
                    {apartments.map((apartment, index) => (
                        <div className="col-3 mb-4" key={index}>
                            <div className="card">
                            <img src={apartment.image} className="card-img-top" alt={apartment.name}/>
                            <div className="card-body">
                                <h5 className="card-title">{apartment.name}</h5>
                                <p className="card-text">{apartment.description}</p>
                                
                                <button onClick={()=>{selectApartment(index)}} type='button' className="btn btn-outline-primary btn-sm float-end"><i><small>More</small></i> &rarr;</button>
                                
                            </div>
                            <div className="card-footer text-sm"><i><small>{apartment.owner} - {apartment.address}</small></i></div>
                            </div>
                        </div>
                        ))}
                    </div>

                 </div>
            
                        <Footer />
            </div>
        );
    

    }
export default Home;
    