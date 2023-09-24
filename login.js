const mysql = require('mysql');
const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);

  if (urlObj.pathname === '/') {
    // Serve the HTML form
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (urlObj.pathname === '/login') {
    // Handle login form submission
    const formData = urlObj.query;

    const connection = mysql.createConnection({
      host: 'localhost',   // Use 'localhost' or '127.0.0.1'
      port: 3306,           // Port number
      user: 'root',
      password: 'root123',
      database: 'stock_user_db'
    });

    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      const query = `SELECT * FROM stock_user_db.user_info WHERE username = '${formData.username}' AND password = '${formData.password}'`;
      connection.query(query, (err, results) => {
        connection.end(); // Close the connection

        if (err) {
          console.error('Error querying MySQL:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }

        if (results.length === 1) {
          // User found, show welcome message
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Welcome, ' + formData.username + '!');
        } else {
          // User not found, show wrong credentials message
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Wrong credentials. Please try again.');
        }
      });
    });
  } else {
    // Handle other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
