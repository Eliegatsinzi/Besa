import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { example_backend } from 'declarations/example_backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion'; // Import Framer Motion for animations

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  // Function to generate a unique staff ID
  const generateStaffId = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const segments = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]; // Define segment lengths
    let result = "";

    for (const seg of segments) {
      for (let i = 0; i < seg; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length); // Generate random index
        result += chars[randomIndex]; // Append character
      }
      result += "-"; // Append a hyphen after each segment
    }

    return result.slice(0, -1); // Remove the last hyphen
  };

  useEffect(() => {
    const checkAndRegisterDefaultAdmin = async () => {
      try {
        const staffList = await example_backend.getStaff(); // Fetch the list of registered staff

        if (staffList.length === 0) {
          // Generate a unique staff ID for the default admin
          const defaultStaffId = generateStaffId();
          // Register the default admin
          await example_backend.addStaff('admin', 'admin123', defaultStaffId);
          console.log('Default admin staff registered with ID:', defaultStaffId);
        }
      } catch (error) {
        console.error('Error checking or registering default admin:', error);
        setErrorMessage('An error occurred while initializing. Please try again later.');
      } finally {
        setIsChecking(false); // Set the flag to false after checking
      }
    };

    checkAndRegisterDefaultAdmin();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isChecking || loading) {
      // Prevent submission while checking/initializing or loading
      return;
    }

    setLoading(true); // Set loading to true to show the spinner

    try {
      // Call the backend to verify staff credentials
      const isAuthenticated = await example_backend.staffLogin(id, password);

      if (isAuthenticated) {
        // Simulate a short delay for better UX
        setTimeout(() => {
          // Login successful
          const staffUser = { id: id, role: 'admin' };
          onLogin(staffUser);
          navigate('/dashboard'); // Replace with the appropriate route for staff
        }, 1000); // Delay in milliseconds
      } else {
        // Login failed
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h2 className="text-center">Besa Platform</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  <div className="mb-3">
                    <label htmlFor="id" className="form-label">User ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="id"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isChecking || loading} // Disable button while checking or loading
                  >
                    {loading ? (
                      <span>Loading...</span> // Loading text or spinner
                    ) : (
                      'Login'
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;
