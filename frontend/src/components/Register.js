// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', user); // Correct API endpoint

      setSuccessMessage('Registration Successful! You can now login.');
      setErrorMessage('');
      setUser({
        username: '',
        email: '',
        password: '',
      }); // Reset form fields after successful registration
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed.');
      setSuccessMessage('');
    }
    setLoading(false); // Stop loading
  };

  return (
    <div>
      <h1>Register</h1>
      {loading && <p>Loading...</p>} {/* Loading Indicator */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Register</button> {/* Disable button during loading */}
      </form>
    </div>
  );
};

export default Register;

/*Changes Made:
Loading State:

I added a loading state to show a "Loading..." message while the form is being submitted.
The submit button is disabled during loading to prevent multiple submissions.
Reset Form Fields:

After a successful registration, the form fields (username, email, password) are reset to empty strings to allow for a fresh registration if needed.
Disable Button During Submission:

The register button is disabled during the submission to prevent the user from clicking it multiple times while waiting for a response.*/