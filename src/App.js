// src/App.js
import React, { useEffect, useState } from 'react';

function App() {
  const [loginData, setLoginData] = useState([]);

  useEffect(() => {
    // Fetch data from the server
    fetch('/api/login') // Updated to use proxy
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setLoginData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>Login Data</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th> 
          </tr>
        </thead>
        <tbody>
          {loginData.map((login) => (
            <tr key={login.id}>
              <td>{login.username}</td>
              <td>{login.password}</td>
              {/* Add more cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;