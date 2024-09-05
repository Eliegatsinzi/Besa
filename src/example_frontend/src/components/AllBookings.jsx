import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { example_backend } from 'declarations/example_backend';
import NavBar from './NavBar';
import StaffFooter from './StaffFooter';

function AllBookings() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [apartments, setApartments] = useState({});
    const [principal, setPrincipal] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchPrincipal = async () => {
            const authClient = await AuthClient.create();
            const identity = authClient.getIdentity();
            setPrincipal(identity.getPrincipal().toText());
        };

        fetchPrincipal();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (principal) {
                try {
                    const allBookings = await example_backend.getBookings();
                    const allApartments = await example_backend.getHouse();
                    
                    // Map apartments to IDs
                    const apartmentMap = allApartments.reduce((acc, apartment) => {
                        acc[apartment.id] = apartment.name;
                        return acc;
                    }, {});

                    // Filter bookings
                    const myBookings = allBookings.filter(booking => 
                        booking.paymentStatus === 'success' ||
                        booking.paymentStatus === 'successful'
                    );

                    setBookings(myBookings);
                    setFilteredBookings(myBookings);
                    setApartments(apartmentMap);
                } catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            }
        };

        fetchData();
    }, [principal]);

    useEffect(() => {
        const filterBookingsByDate = () => {
            if (startDate && endDate) {
                const filtered = bookings.filter(booking => 
                    new Date(booking.startISO) >= new Date(startDate) &&
                    new Date(booking.endISO) <= new Date(endDate)
                );
                setFilteredBookings(filtered);
            } else {
                setFilteredBookings(bookings);
            }
        };

        filterBookingsByDate();
    }, [startDate, endDate, bookings]);

    return (
        <div>
            <div className="container mt-5">
                <h3 className="mb-4">All Bookings</h3>
                
                <div className="mb-4">
                    <label htmlFor="start-date" className="form-label">Start Date:</label>
                    <input 
                        type="date" 
                        id="start-date" 
                        className="form-control" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                    />
                    <label htmlFor="end-date" className="form-label">End Date:</label>
                    <input 
                        type="date" 
                        id="end-date" 
                        className="form-control" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                    />
                </div>
                
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Apartment Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Total Price</th>
                            <th>Customer Name</th>
                            <th>Customer Phone</th>
                            <th>Customer Email</th>
                            <th>Transaction Reference</th>
                            <th>Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length > 0 ? filteredBookings.map((booking, index) => (
                            <tr key={index}>
                                <td>{apartments[booking.apartmentId] || 'Unknown'}</td>
                                <td>{booking.startISO}</td>
                                <td>{booking.endISO}</td>
                                <td>{booking.totalPrice} RWF</td>
                                <td>{booking.customerName}</td>
                                <td>{booking.customerPhone}</td>
                                <td>{booking.customerEmail}</td>
                                <td>{booking.txRef}</td>
                                <td>{booking.txId}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="9">No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <StaffFooter />
        </div>
    );
}

export default AllBookings;
