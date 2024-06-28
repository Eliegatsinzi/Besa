import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { example_backend } from 'declarations/example_backend';
import { BrowserRouter as Router, Route,  Routes, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import NavBar from './NavBar';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'


import { useParams } from "react-router-dom";
import Footer from './Footer';


function Booking (){

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [principal, setPrincipal] = useState(null);

    const {houseId} = useParams();
    const [apartments, setApartments] = useState([]);
    const [apartment, setApartment] = useState({});

    const [show, setShow] = useState(false);

    const [isDateCorrect, setIsDateCorrect] = useState(true);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSignIn = () => {
        setShow(false);
        signIn();
    };

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
    
    
    const getHouse = async () => {
        try {
          const houses = await example_backend.getHouse();
          
            setApartments(houses);
            
       

            apartments.forEach((house, index) => {
                if(index == houseId){
                setApartment({name:house.name, address: house.address, owner: house.owner, phone: house.phone, price: house.price, description: house.description, image: house.image});
                   
                }
               
            });
          
        } catch (error) {
          console.error("Failed to fetch Houses:", error);
        }
      };
      
      getHouse();

      //HANDLE START DATE
      const compareDates = (d2) => {
        let date1 = new Date().getTime();
        let date2 = new Date(d2).getTime();
      
        if (date1 <= date2) {
          setIsDateCorrect(true);
          document.getElementById("start").innerHTML="";
          document.getElementById("submit").style.disabled=false;
          setStartDate(d2);
        } 
        else {
          setIsDateCorrect(false);
          document.getElementById("start").innerHTML="You can't choose past date please!";
          document.getElementById("submit").style.disabled=true;
          console.log(`INCORRECT DATE`);     
        }
        
      };
      
      //HANDLE END DATE 
      const compareDiff = (d1, d2) => {
        let date = new Date().getTime();
        let date1 = new Date(d1).getTime();
        let date2 = new Date(d2).getTime();
      
        // Calculating the time difference
        // of two dates
        let Difference_In_Time =
        date2.getTime() - date1.getTime();

        // Calculating the no. of days between
        // two dates
        let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

        if (Difference_In_Days <= 5) {
          setIsDateCorrect(true);
          document.getElementById("start").innerHTML="";
          document.getElementById("submit").style.disabled=false;
          setStartDate(d2);
        } 
        else {
          setIsDateCorrect(false);
          document.getElementById("start").innerHTML="You can't book more than 5 days!";
          document.getElementById("submit").style.disabled=true;
          console.log(`INCORRECT DATE`);     
        }
        
      };
      
const booked = (house) => {
  Swal.fire({
    title: "Done!",
    text: `You have booked a ${house} house successfully!`,
    icon: "success"
  });
}

    return (
        <div>
            <NavBar />

                <div className="row mt-3 mb-5">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <div className="card shadow">
                        <div className="card-body">
                            <div className="card-title text-center"><h3> { apartment.name } </h3></div>

                            <div className="text-center">
                                <img src={ apartment.image } alt="House" className='img-fluid mt-3 mb-3' width="200" height="100"/>
                            </div>

                            <div className="card-text">
                            Owner: { apartment.owner } <br />
                            Location: { apartment.address } <br />
                            Price: { Number(apartment.price) } rwf <br />
                            Description: { apartment.description } <br />

                            </div>
                            {!isLoggedIn?(<Button variant="primary mt-3" onClick={handleShow}>Book now</Button>):
                            (
                            <div className='mt-3'>
                                <h5>Booking Information</h5>
                                <hr />

                                <form action="">
                                  <div className="row">
                                    Your ID: 
                                    <p>{String(principal)} </p>
                                    <div className="col-md-6">
                                      <label htmlFor="">Starting</label>
                                      <input type="date" className="form-control" name = "starting" onChange={(e)=>{compareDates(e.target.value)}}/>
                                    </div>
                                    <div className="col-md-6">
                                      <label htmlFor="">Ending date</label>
                                      <input type="date" className="form-control" name='ending' onChange={(e)=>{compareDates(e.target.value)}}/>
                                    </div>
                                    <div className="text-danger" id='start'></div>
                                    <label htmlFor="">Payment Method:</label>
                                    <select name="payment" id="" className='form-control'>
                                      <option value="" selected disabled>Choose your payment method</option>
                                      <option value="momo">MTN MoMo</option>
                                      <option value="airtel">Airtel Money</option>
                                      <option value="bank">Local Banks</option>
                                      <option value="cash">CASH</option>
                                    </select>
                                  </div>
                                {isDateCorrect?(
                                <button className="btn btn-success mt-3" type='button' id='submit' onClick={()=>{booked(apartment.name )}}>BOOK</button>
                                ):(<button className="btn btn-success mt-3" type='button' id='submit' disabled>BOOK</button>)}
                                </form>
                            </div>
                            )
                            }
                        </div>

                        </div>
                    </div>
                    <div className="col-md-4"></div>
                </div>

            {/* LOGIN MODAL */}
                
                <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You must be logged in to Book a House!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSignIn}>
                        Login here
                    </Button>
                    </Modal.Footer>
                </Modal>
                </>
                {/* END MODAL */}
             <Footer/>  
        </div>
    );
}

export default Booking;