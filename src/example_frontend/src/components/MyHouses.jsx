import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { example_backend } from 'declarations/example_backend';
import NavBar from './NavBar';
import Footer from './Footer';

function MyHouses() {
    const [houses, setHouses] = useState([]);
    const [principal, setPrincipal] = useState(null);

    useEffect(() => {
        const fetchPrincipal = async () => {
            const authClient = await AuthClient.create();
            const identity = authClient.getIdentity();
            setPrincipal(identity.getPrincipal().toText());
        };

        fetchPrincipal();
    }, []);

    useEffect(() => {
        const getMyHouses = async () => {
            if (principal) {
                try {
                    const allHouses = await example_backend.getHouse();
                    const myHouses = allHouses.filter(house => house.owner === principal);

                    setHouses(allHouses);
                } catch (error) {
                    console.error("Failed to fetch houses:", error);
                }
            }
        };

        getMyHouses();
    }, [principal]);

    return (
        <div>
            <NavBar />
            <div className="container mt-5">
                <h3>Available Houses</h3>
                <div className="row">
                    {houses.length > 0 ? houses.map((house, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="card mb-4">
                                <img src={house.image} className="card-img-top" alt={house.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{house.name}</h5>
                                    <p className="card-text">{house.address}</p>
                                    <p className="card-text">Price per night: {house.price} RWF</p>
                                    <p className="card-text">Status: {house.status}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-md-12">
                            <p>No houses registered by you.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MyHouses;
