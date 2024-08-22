import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { example_backend } from 'declarations/example_backend';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import NavBar from './NavBar';
import Footer from './Footer';

const NewHouse = ({ userId, userInfo }) => {
    // console.log(userId);
    const [apartments, setApartments] = useState([]);
    const [apartment, setApartmentss] = useState({ id: '', name: '', address: '', owner: '', phone: '', price: '', description: '', image: null, status: 'Available' });
    const [principal, setPrincipal] = useState(null);
    const [staffId, setStaffId] = useState(''); // Add state to store staff ID

    const canisterId = process.env.CANISTER_ID_EXAMPLE_FRONTEND;
    const home = `/?canisterId=${canisterId}`;

    const saveHouse = async (event) => {
        event.preventDefault();

        let id = apartments.length;

        const ownerPrincipal = staffId; 

        try {
            await example_backend.addHouse(
                id,
                apartment.name,
                apartment.address,
                staffId, // Use staff ID instead of principal
                apartment.phone,
                apartment.price,
                apartment.description,
                apartment.image,
                apartment.status,
                staffId // Ensure principal is in text format
            );
            setApartmentss({ id: '', name: '', address: '', owner: '', phone: '', price: '', description: '', image: null, status: '' });
            // location.href = home;
            Navigate("/house-list");
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setApartmentss({ ...apartment, [name]: value });
    };

    const imageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setApartmentss({ ...apartment, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        console.log(userId);
        getHouse();
        
        const fetchPrincipal = async () => {
            const staffInfo = await example_backend.getStaffByNid(userId);
            console.log(staffInfo);
            if (staffInfo.length > 0) {
                setStaffId(staffInfo[0].staffId); // Set staff ID
            }else{
                console.error("Failed to fetch staff info:", staffInfo);
            }
        };

        fetchPrincipal();
    }, []);

    useEffect(() => {
        if (principal) {
            setApartmentss({ ...apartment, owner: staffId }); // Update owner with staff ID
        }
    }, [principal, staffId]);

    return (
        <>
            <h4 className='text-center'>New Apartment</h4>
            <div className="row mt-2 mb-5">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="card-title text-center"><h5> </h5></div>
                            <form onSubmit={saveHouse}>
                                <input type="hidden" name="owner" value={staffId} /> {/* Use staff ID */}
                                <div className="form-group mb-2">
                                    <label htmlFor="name">Apartment name:</label>
                                    <input type="text" id='name' className="form-control" name='name' required value={apartment.name} onChange={handleInputChange} />
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="location">Location:</label>
                                    <input type="text" id='location' className="form-control" name='address' required value={apartment.address} onChange={handleInputChange} />
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="ownername">Owner's System Id:</label>
                                    <input type="text" id='ownername' readOnly className="form-control" name='owner' required value={staffId} onChange={handleInputChange} /> {/* Display staff ID */}
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="phone">Your phone number:</label>
                                    <input type="text" id='phone' className="form-control" name='phone' required value={apartment.phone} onChange={handleInputChange} />
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="price">Price per day:</label>
                                    <input type="number" id='price' className="form-control" name='price' required value={apartment.price} onChange={handleInputChange} />
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="photo">Photo:</label>
                                    <input type="file" id='photo' className="form-control" name='image' required onChange={imageChange} />
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="description">Description:</label>
                                    <textarea name="description" id="description" cols="30" rows="2" required className='form-control' value={apartment.description} onChange={handleInputChange}></textarea>
                                </div>
                                <button type="submit" className='btn btn-success shadow'>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6"></div>
            </div>
            {/* <Footer /> */}
        </>
    );
}

export default NewHouse;
