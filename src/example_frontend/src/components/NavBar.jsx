import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { example_backend } from 'declarations/example_backend';
import { BrowserRouter as Router, Route,  Routes, Link } from "react-router-dom";


function NavBar (){

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [principal, setPrincipal] = useState(null);
    
    const [users, setUsers] = useState([]); 
    const [newUser, setNewUser] = useState('');
  
    const [apartments, setApartments] = useState([]);
    const [apartment, setApartmentss] = useState({name: '', address: '', owner:'', phone: '', price: '', description:'', image: null});
    
    const [selectedApartment, setSelectedApartment] = useState(null);
 
    const canisterId = process.env.CANISTER_ID_EXAMPLE_FRONTEND;
    const newhouse = `/newhouse?canisterId=${canisterId}`;
    const home = `/?canisterId=${canisterId}`;
  
    const authClientPromise = AuthClient.create();
  
    const signIn = async () => {
      const authClient = await authClientPromise;
      const internetIdentityUrl = process.env.NODE_ENV === 'production'
        ? undefined
        : `http://localhost:4943/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`;
  
      await new Promise((resolve) => {
        authClient.login({
          identityProvider: internetIdentityUrl,
          onSuccess: () => resolve(undefined),
        });

        getUsers();
        let availabe = 0;
        users.forEach( (user, index) => {
            if (user == String(principal)) {
                availabe += 1;
            }
            if (availabe == 0) {
           
                saveUser();     
            }
            });
      });
  
      const identity = authClient.getIdentity();
      updateIdentity(identity);
      setIsLoggedIn(true);
    };
  
    const signOut = async () => {
      const authClient = await authClientPromise;
      await authClient.logout();
      updateIdentity(null);
    };
    
    const updateIdentity = (identity) => {
      if (identity) {
        setPrincipal(identity.getPrincipal());
        // Create Actor with HttpAgent
        const agent = new HttpAgent();
        const actor = Actor.createActor(example_backend, { agent: agent });
        example_backend.setActor(actor); // Set the actor for example_backend
      } else {
        setPrincipal(null);
        example_backend.setActor(null); // Clear the actor
      }
    };
    useEffect(() => {
      const checkLoginStatus = async () => {
        const authClient = await authClientPromise;
        const isAuthenticated = await authClient.isAuthenticated();
        setIsLoggedIn(isAuthenticated);
        if (isAuthenticated) {
          const identity = authClient.getIdentity();
          updateIdentity(identity);
          const storedStudents = localStorage.getItem('students');
          const storedCourses = localStorage.getItem('courses');
          if (storedStudents && storedCourses) {
            setStudents(JSON.parse(storedStudents));
            setCourses(JSON.parse(storedCourses));
          } else {
            fetchStudents();
            fetchCourses();
          }
        }
      };
    
      checkLoginStatus();
    }, []);
    
    
  
    const getUsers = async () => {
      try {
        const user = await example_backend.getUsers();
        
        setUsers(user);

        let availabe = 0;
        users.forEach( (user, index) => {
            if (user == String(principal)) {
                availabe += 1;
            }
        });
       
        
      } catch (error) {
        console.error("Failed to fetch Users: ", error);
      }
    };

    const saveUser = async () => {
        
        let hash = String( principal );
      
        try {
          await example_backend.addUser(hash);
          
          console.log("User added");
        } catch (error) {
          console.error("Failed to add User:", error);
        }
      };

    if(isLoggedIn){

        getUsers();
    }

    return (
        
        <div>
            <nav className="navbar navbar-expand-lg border-bottom navbar-light" style={{backgroundColor: "#e3f2fd"}}>
                <div className="container">
                <Link to={home} className="navbar-brand" href="#"><h3> <center>Welcome to BESA </center></h3></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {isLoggedIn ? (
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                    
                        <li className="nav-item">
                        <Link to={newhouse} className="nav-link btn btn-link" aria-current="page">Add House</Link>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link btn btn-link" aria-current="page">My Houses</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link btn btn-link" aria-current="page">
                             - { String(principal) }</a>
                        </li>
                    </ul>
                    ): (<></>)}
                    
                    <div className="d-flex">
                    
                    { !isLoggedIn ? (<button className="btn btn-primary me-2" onClick={signIn}>LogIn</button>):(<button className="btn btn-danger me-2" onClick={signOut}>Logout</button>) }
                    </div>

                </div>
                </div>
            </nav>
        </div>
        );
    

    }
export default NavBar;
    