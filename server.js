const http = require('http');
const fs = require('fs');
const path = require('path');
const sql = require('mssql');

// Database configuration
const config = {
  user: 'admintest',
  password: 'Test123!',
  server: 'testdb2023.database.windows.net',
  database: 'testdb!',
  options: {
    encrypt: true,
  },
};

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Respond to preflight request
    res.writeHead(200);
    res.end();
    return;
  }

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
  } else if (req.url.startsWith('/static') || req.url.startsWith('/js') || req.url.startsWith('/css')) {
    // Serve static files for the React build (adjust the paths as needed)
    const filePath = path.join(__dirname, 'msserver_test/build', req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': getContentType(req.url) });
        res.end(data);
      }
    });
  } else if (req.url === '/') {
    // Serve the React index.html file
    const filePath = path.join(__dirname, 'msserver_test/build', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    // Handle other routes or requests
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Function to determine content type based on file extension
function getContentType(url) {
  const extname = path.extname(url);
  switch (extname) {
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    default:
      return 'text/plain';
  }
}

// Start the server
const port = process.env.PORT || 8080; // Use the PORT environment variable on Azure
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
