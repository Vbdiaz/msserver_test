// server.js
const http = require('http');
const sql = require('mssql');

// Database configuration
const config = {
  user: 'admintest',
  password: 'Test123!',
  server: 'testdb2023.database.windows.net', // Replace with your actual server address
  database: 'testdb!',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
  },
};

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/login' && req.method === 'GET') {
    try {
      // Connect to the database
      await sql.connect(config);

      // Query to fetch data from the login table
      const result = await sql.query('SELECT * FROM login');

      // Send the data as JSON
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.recordset));
    } catch (error) {
      console.error('Error fetching data:', error.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } finally {
      // Close the database connection
      await sql.close();
    }
  } else {
    // Handle other routes or requests
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});