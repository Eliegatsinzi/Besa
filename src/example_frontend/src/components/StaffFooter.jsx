import React from 'react';
import { Link } from 'react-router-dom';

const StaffFooter = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Gatsinzi. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default StaffFooter;
