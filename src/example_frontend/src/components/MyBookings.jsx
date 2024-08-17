import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { example_backend } from 'declarations/example_backend';
import NavBar from './NavBar';
import Footer from './Footer';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
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
        const getMyBookings = async () => {
            if (principal) {
                try {
                    const allBookings = await example_backend.getBookings();
                    const myBookings = allBookings.filter(booking => booking.userPrincipal === principal);
                    setBookings(allBookings);
                } catch (error) {
                    console.error("Failed to fetch bookings:", error);
                }
            }
        };

        getMyBookings();
    }, [principal]);

    return (
        <div>
            <NavBar />
            <div className="container mt-5">
                <h3>My Bookings</h3>
                <div className="row">
                    {bookings.length > 0 ? bookings.map((booking, index) => (
                        <div className="col-md-6" key={index}>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Booking for {booking.apartmentName}</h5>
                                    <p className="card-text">Dates: {booking.startISO} to {booking.endISO}</p>
                                    <p className="card-text">Total Price: {booking.totalPrice} RWF</p>
                                    <p className="card-text">Payment Status: {booking.paymentStatus}</p>
                                    <p className="card-text">Transaction Reference: {booking.txRef}</p>
                                    <p className="card-text">Transaction ID: {booking.txId}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-md-12">
                            <p>No bookings made by you.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MyBookings;
