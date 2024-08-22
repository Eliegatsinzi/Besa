import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route,  Routes, Link } from "react-router-dom";


function Footer (){

   
    return (
        
      
            <footer className="footer bg-dark text-light pt-3 pb-3 mt-5">
                {/* link to staff access */}
                <div className="container text-center">
                    <Link to="/staffaccess" className="text-light">Staff Access</Link>
                </div>
                <div className="container text-center">
                Developed by <b>GATSINZI</b> &copy;Copyright reserved
                </div>
            </footer>
      
        );
    

    }
export default Footer;
    