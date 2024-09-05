import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { example_backend } from 'declarations/example_backend';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function NavBar({ setPrincipal }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [principal, setPrincipalState] = useState(null);

    const canisterId = process.env.CANISTER_ID_EXAMPLE_FRONTEND;
    const newhouse = `/newhouse?canisterId=${canisterId}`;
    const home = `/?canisterId=${canisterId}`;
    const myhouses = `/myhouses?canisterId=${canisterId}`;
    const mybookings = `/mybookings?canisterId=${canisterId}`;

    const authClientPromise = AuthClient.create();

    const signIn = async () => {
        const authClient = await authClientPromise;
        const internetIdentityUrl = process.env.NODE_ENV === 'production'
            ? undefined
            : `http://localhost:4943/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`;

        await new Promise((resolve) => {
            authClient.login({
                identityProvider: internetIdentityUrl,
                onSuccess: () => {
                    const identity = authClient.getIdentity();
                    console.log('Login Successful: ', identity);
                    
                    updateIdentity(identity);
                    resolve(identity);
                    window.location.reload();
                },
                onError: (e) => {
                    console.error('Login Error: ', e);
                    resolve(null);
                }
            });
        });

        const identity = authClient.getIdentity();
        setIsLoggedIn(true);
    };

    const signOut = async () => {
        const authClient = await authClientPromise;
        await authClient.logout();
        window.location.href = "/";
        updateIdentity(null);
    };

    const updateIdentity = (identity) => {
        if (identity) {
            const principalId = identity.getPrincipal();
            setPrincipalState(principalId);
            setPrincipal(principalId);

            const agent = new HttpAgent({
                host: `http://${process.env.CANISTER_ID_EXAMPLE_BACKEND}.localhost:4943`
            });

            if (process.env.NODE_ENV !== 'production') {
                agent.fetchRootKey();
            }

            const actor = Actor.createActor(example_backend, {
                agent,
                canisterId: process.env.CANISTER_ID_EXAMPLE_BACKEND,
            });

            example_backend.setActor(actor);
        } else {
            setPrincipalState(null);
            setPrincipal(null);
            example_backend.setActor(null);
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
            }
        };
        checkLoginStatus();
    }, []);

    return (
        <div>
            <nav className="navbar navbar-expand-lg border-bottom navbar-light" style={{ backgroundColor: "#e3f2fd" }}>
                <div className="container">
                    <Link to={home} className="navbar-brand"><h3><center>Welcome to BESA</center></h3></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {isLoggedIn ? (
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link to={home} className="nav-link btn btn-link" aria-current="page">All Houses</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={mybookings} className="nav-link btn btn-link" aria-current="page">My Bookings</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link btn btn-link" aria-current="page"> User - {String(principal)}</a>
                                </li>
                            </ul>
                        ) : (<></>)}
                        
                        <div className="d-flex">
                            {!isLoggedIn ? (
                                <button className="btn btn-primary me-2" onClick={signIn}>LogIn</button>
                            ) : (
                                <button className="btn btn-danger me-2" onClick={signOut}>Logout</button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
export default NavBar;
