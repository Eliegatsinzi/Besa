import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { example_backend } from 'declarations/example_backend';
import { BrowserRouter as Router, Route,  Routes, Link } from "react-router-dom";
import NavBar from './NavBar';
import Footer from './Footer';

const NewHouse = () => {


    const [apartments, setApartments] = useState([]);
    const [apartment, setApartmentss] = useState({id: '', name: '', address: '', owner:'', phone: '', price: '', description:'', image: null, status:'Available'});

    const canisterId = process.env.CANISTER_ID_EXAMPLE_FRONTEND;
    const home = `/?canisterId=${canisterId}`;
    //SAVE A NEW HOUSE
    const saveHouse = async (event) => {
        event.preventDefault();

        getHouse();

        let id = apartments.length;
      
      
        try {
          await example_backend.addHouse(id, apartment.name, apartment.address, apartment.owner, apartment.phone, apartment.price, apartment.description, apartment.image, apartment.status );
          
          setApartmentss({id:'', name: '', address: '', owner:'', phone: '', price: '', description:'', image: null,status:''});

          location.href = home;
         
        } catch (error) {
          console.error("Failed to add House:", error);
        }
      };

      const getHouse = async () => {
        try {
          const houses = await example_backend.getHouse();
          
          setApartments(houses);
          
        } catch (error) {
          console.error("Failed to fetch Houses:", error);
        }
      };

          //INPUT CHANGE
    const handleInputChange = (event) => {
      
        const { name, value } = event.target;
    
        setApartmentss({ ...apartment, [name]: value });
      };
      
      // IMAGE CHANGE
      const imageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
          setApartmentss({...apartment, image: reader.result });
          
        };
        reader.readAsDataURL(file);
      };
        
    
  return (

    // ADD NEW HOUSE
    <>
    <NavBar />
    <h4 className='text-center'>New Apartment</h4>
    <div className="row mt-2 mb-5">
    <div className="col-md-3"></div>
    <div className="col-md-6">
        <div className="card shadow">
        <div className="card-body">
            <div className="card-title text-center"><h5> </h5></div>
            
            <form action="" onSubmit={saveHouse}>
            <div className="form-group mb-2">
                <label htmlFor="name">Apartment name:</label>
                <input type="text" id='name' className="form-control" name='name' required value={apartment.name} onChange={handleInputChange}/>
            </div>
            
            <div className="form-group mb-2">
                <label htmlFor="location">Location:</label>
                <input type="text" id='location' className="form-control" name='address'required value={apartment.address} onChange={handleInputChange}/>
            </div>
            
            <div className="form-group mb-2">
                <label htmlFor="ownername">Owner's name:</label>
                <input type="text" id='ownername' className="form-control" name='owner'  required  value={apartment.owner} onChange={handleInputChange}/>
            </div>
            
            <div className="form-group mb-2">
                <label htmlFor="phone">Your phone number:</label>
                <input type="text" id='phone' className="form-control" name='phone' required value={apartment.phone} onChange={handleInputChange}/>
            </div>
            
            <div className="form-group mb-2">
                <label htmlFor="price">Price per day:</label>
                <input type="number" id='price' className="form-control" name='price' required  value={apartment.price} onChange={handleInputChange}/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="photo">photo:</label>
                <input type="file" id='photo' className="form-control" name='image' required onChange={imageChange}/>
            </div>
            
            <div className="form-group mb-2">
                <label htmlFor="description">Description:</label>
                <textarea name="description" id="description" cols="30" rows="2" required className='form-control'  value={apartment.description} onChange={handleInputChange}></textarea>
            </div>
            <button type="submit" className='btn btn-success shadow'>Save</button>
            </form>
        </div>

        </div>
    </div>
    <div className="col-md-6"></div>
    </div>
    <Footer />
    </>

    );  
}

export default NewHouse;