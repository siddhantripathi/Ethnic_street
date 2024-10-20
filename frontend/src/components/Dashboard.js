// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [protectedData, setProtectedData] = useState(null);

  const fetchProtectedData = async () => {
    const token = localStorage.getItem('token');  // Get the JWT token from localStorage
    if (!token) {
      console.log('No token found');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/protected', {
        headers: {
          'x-auth-token': token,  // Send the token in the headers
        },
      });
      setProtectedData(response.data);  // Store the protected data in the state
    } catch (error) {
      console.error('Error fetching protected data:', error);
    }
  };

  // Fetch the protected data when the component mounts
  useEffect(() => {
    fetchProtectedData();
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      {protectedData ? (
        <div>
          <h2>Protected Data:</h2>
          <pre>{JSON.stringify(protectedData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading protected data...</p>
      )}
    </div>
  );
}

export default Dashboard;
