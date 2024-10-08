import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { example_backend } from 'declarations/example_backend';
import Button from 'react-bootstrap/Button';
import NavBar from './NavBar';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { Navigate, useParams } from "react-router-dom";
import Footer from './Footer';
import { v4 as uuidv4 } from 'uuid';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import axios from 'axios';

function Booking() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [principal, setPrincipal] = useState(null);
    const { houseId } = useParams();
    const [apartment, setApartment] = useState({});
    const [isDateCorrect, setIsDateCorrect] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [txRef, setTxRef] = useState(uuidv4());
    const [txId, setTxId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [existingBookings, setExistingBookings] = useState([]);

    const authClientPromise = AuthClient.create();

    const signIn = async () => {
        try {
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
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const signOut = async () => {
        try {
            const authClient = await authClientPromise;
            await authClient.logout();
            updateIdentity(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookings = await example_backend.getBookings();
                setExistingBookings(bookings);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            }
        };
    
        fetchBookings();
    }, []);

    const updateIdentity = (identity) => {
        if (identity) {
            setPrincipal(identity.getPrincipal());
            const agent = new HttpAgent();
            const actor = Actor.createActor(example_backend, { agent });
            example_backend.setActor(actor);
        } else {
            setPrincipal(null);
            example_backend.setActor(null);
        }
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const authClient = await authClientPromise;
                const isAuthenticated = await authClient.isAuthenticated();
                setIsLoggedIn(isAuthenticated);
                if (isAuthenticated) {
                    const identity = authClient.getIdentity();
                    updateIdentity(identity);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        const getHouse = async () => {
            try {
                const houses = await example_backend.getHouse();
                const selectedApartment = houses[houseId];
                if (selectedApartment) {
                    setApartment({
                        name: selectedApartment.name,
                        address: selectedApartment.address,
                        owner: selectedApartment.owner,
                        phone: selectedApartment.phone,
                        price: Number(selectedApartment.price),
                        description: selectedApartment.description,
                        image: selectedApartment.image
                    });
                }
            } catch (error) {
                console.error("Failed to fetch Houses:", error);
            }
        };

        getHouse();
    }, [houseId]);

    const compareDates = (d2) => {
        const date1 = new Date().getTime();
        const date2 = new Date(d2).getTime();

        if (date1 <= date2) {
            setIsDateCorrect(true);
            setStartDate(d2);
        } else {
            setIsDateCorrect(false);
            setStartDate(null);
            setEndDate(null);
        }
    };

    const compareDiff = (d1, d2) => {
        const date1 = new Date(d1).getTime();
        const date2 = new Date(d2).getTime();
        const differenceInDays = Math.round((date2 - date1) / (1000 * 3600 * 24));

        if (differenceInDays > 0 && differenceInDays <= 5) {
            setIsDateCorrect(true);
            setEndDate(d2);
            calculateTotalPrice(differenceInDays);
            // Check for overlap after setting the end date
            const hasOverlap = checkOverlap(d1, d2, houseId);
            setIsDateCorrect(!hasOverlap);
            if (hasOverlap) {
                Swal.fire({
                    title: "Error!",
                    text: "Selected dates overlap with an existing booking. Please choose different dates.",
                    icon: "error"
                });
            }
        } else if (differenceInDays > 5) {
            setIsDateCorrect(false);
        } else {
            setIsDateCorrect(false);
        }
    };

    const calculateTotalPrice = (days) => {
        if (apartment.price) {
            setTotalPrice(apartment.price * days);
        } else {
            setTotalPrice(0);
        }
    };

    const config = {
        // public_key: 'FLWPUBK-d93b193ef5fcf9c4029e807e787358fd-X',
        public_key: 'FLWPUBK_TEST-18c644fa7fff564a38749a3da2a7cde0-X',
        tx_ref: txRef,
        amount: totalPrice,
        currency: 'RWF',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: customerEmail,
            phone_number: customerPhone,
            name: customerName,
        },
        customizations: {
            title: 'Booking Payment',
            description: `Payment for booking ${apartment.name}`,
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    };

    const handleFlutterPayment = useFlutterwave(config);
    // import axios from 'axios';

    const sendMessage = async (transaction_id,amount) => {
    const formData = new FormData();
    formData.append('sender_id', 'L7-IT');
    formData.append('ref', 'sms');
    formData.append('message', `Dear ${customerName}, your booking for ${apartment.name} is confirmed. your transaction id is ${transaction_id} , Amount paid : ${amount} Rwf  Thank you!`);
    formData.append('tel', customerPhone);

    try {
        const response = await axios.post(
        'https://sms-api.hdev.rw/v1/api/HDEV-36691687-9144-4e4c-b769-62443d655e15-ID/HDEV-2a1749da-be37-4421-b982-81f10cc53301-KEY',
        formData,
        {
            headers: {
            'Content-Type': 'multipart/form-data',
            // Add any additional headers if necessary
            // Example: 'Authorization': 'Bearer YOUR_TOKEN'
            }
        }
        );
        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
    };
    // check over

    const handlePayment = () => {
        handleFlutterPayment({
            callback: async (response) => {
                console.log(response);
                if (response.status === 'successful') {
                    setTxId(response.transaction_id);
                    setPaymentStatus(response.status);
                    await example_backend.updateBooking(txRef, (response.transaction_id).toString(), response.status);
                    Swal.fire({
                        title: "Success!",  
                        text: `Transaction status: ${response.status}`,
                        icon: "success"
                    });

                    // Send message to the client
                    // sendMessage();
                    sendMessage(response.transaction_id,totalPrice);
                    Navigate('/');
                } else {
                    Swal.fire({
                        title: "Payment Failed!",
                        text: "The payment was not successful. Please try again.",
                        icon: "error"
                    });
                }
                closePaymentModal();
            },
            onClose: () => {
                console.log("Payment closed");
            }
        });
    };
    const checkOverlap = (newStartDate, newEndDate, houseId) => {
        // Convert new booking dates to timestamps
        const newStart = new Date(newStartDate).getTime();
        // console.log("Start date :");
        // console.log(newStart);
        const newEnd = new Date(newEndDate).getTime();
        // console.log("end date :");
        // console.log(newEnd);
    
        for (let booking of existingBookings) {
            // aprtmentId
            console.log("houseId :");
            console.log(parseInt(houseId));
            console.log("Apartmentid :");
            console.log(parseInt(booking.apartmentId));


            if (!(parseInt(booking.apartmentId) == parseInt(houseId))) {
                continue; // Skip bookings for other houses
            }
            console.log("booking :");
            console.log(booking);
    
            // Convert existing booking dates to timestamps
            const existingStartDate = new Date(booking.startISO).getTime();
            // console.log("exist Start date :");
            // console.log(existingStartDate);
            const existingEndDate = new Date(booking.endISO).getTime();
            // console.log("exist end date :");
            // console.log(existingEndDate);
    
            // Consider only successful bookings
            if (booking.paymentStatus !== "success" && booking.paymentStatus !== "successful") {
                continue;
            }
    
           // Check for overlap (inclusive of the end date)
            if (
                (newStart >= existingStartDate && newStart < existingEndDate) || // Exclude overlap on the exact end date
                (newEnd > existingStartDate && newEnd <= existingEndDate) || // Exclude overlap if newEnd is exactly on the start date
                (newStart <= existingStartDate && newEnd > existingEndDate)   // Exclude bookings that fully overlap
            ) {
                return true; // There is an overlap
            }

        }
        return false; // No overlap
    };
    
    const handleBook = async () => {
        try {
            if (!isDateCorrect || !totalPrice || !customerName || !customerPhone || !customerEmail) {
                // Swal.fire({
                //     title: "Error!",
                //     text: "Please provide all required details and ensure dates are correct.",
                //     icon: "error"
                // });
                return;
            }
            // validate email
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailPattern.test(customerEmail)) {
                // embed the message in the html form 
                Swal.fire({
                    title: "Error!",
                    text: "Please provide a valid email address.",
                    icon: "error"
                });
                return;
            }
            //   public func addBooking(
    // apartmentId: Nat,
    // userPrincipal: Principal,
    // startISO: Text,
    // endISO: Text,
    // totalPrice: Text,
    // customerName: Text,
    // customerPhone: Text,
    // customerEmail: Text,
    // txRef: Text, // Unique transaction reference
    // txId: Text, // Transaction ID, initialized to "none"
    // paymentStatus: Text // Payment status, initialized to "pending"
            // Handle booking
            // await example_backend.addBooking({
            //     houseId,
            //     principal,
            //     txRef: txRef,
            //     txId,
            //     paymentStatus,
            //     customerName,
            //     customerPhone,
            //     customerEmail,
            //     startDate,
            //     endDate,
            //     totalPrice,

            // });
            // Check for booking overlap for the specific house
            const hasOverlap = checkOverlap(startDate, endDate, houseId);
            if (hasOverlap) {
                Swal.fire({
                    title: "Error!",
                    text: "The selected dates overlap with an existing booking for this house. Please choose different dates.",
                    icon: "error"
                });
                return;
            }

            await example_backend.addBooking(parseInt(houseId), principal, startDate, endDate, totalPrice.toString(), customerName, customerPhone, customerEmail, txRef, txId, paymentStatus);

            // Initiate payment
            handlePayment();
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "An error occurred while processing your booking.",
                icon: "error"
            });
        }
    };

    return (
        <div>
            <NavBar isLoggedIn={isLoggedIn} signOut={signOut} />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <img src={apartment.image} className="card-img-top" alt={apartment.name} />
                            <div className="card-body">
                                <h5 className="card-title">{apartment.name}</h5>
                                {/* <p className="card-text">{apartment.description}</p> */}

                                <p className="card-text" dangerouslySetInnerHTML={{ __html: apartment.description }}></p>
                                <p className="card-text">Price per night: {apartment.price} RWF</p>
                                {isLoggedIn && (
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="startDate" className="form-label">Start Date</label>
                                            <input type="date" className="form-control" id="startDate" onChange={(e) => compareDates(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="endDate" className="form-label">End Date</label>
                                            <input type="date" className="form-control" id="endDate" onChange={(e) => compareDiff(startDate, e.target.value)} />
                                        </div>
                                        {!isDateCorrect && (
                                            <div className="alert alert-danger" role="alert">
                                                Invalid dates. Please select dates within the allowed range.
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label htmlFor="customerName" className="form-label">Name</label>
                                            <input type="text" className="form-control" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="customerPhone" className="form-label">Phone</label>
                                            <input type="text" className="form-control" id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="customerEmail" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="customerEmail" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                                        </div>
                                        {/* total price */}
                                        <div className="mb-3">
                                            <label htmlFor="totalPrice" className="form-label">Total Price</label>
                                            <input type="text" className="form-control" id="totalPrice" value={totalPrice} readOnly />
                                        </div>
                                        <Button variant="primary" onClick={handleBook}>Book Now</Button>
                                    </form>
                                )}
                                {!isLoggedIn && (
                                    <Button variant="primary" onClick={signIn}>Sign In to Book</Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Booking;
