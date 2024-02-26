import express from 'express';
import path from 'path';
import os from 'os';
import { initializeDb } from './db-setup.js';
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express();
const port = 8080;
const host = '0.0.0.0';

// Middleware to parse JSON bodies
app.use(express.json());

// Apply the authMiddleware to /api prefixed routes
app.use('/api', authMiddleware);

// Initialize SQLite database
const db = initializeDb();

// Function to get local network IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}


/* ROUTE DEFINITIONS START */
import jwt from 'jsonwebtoken';
const secretKey = 'yourSecretKey'; //TODO LIAM: Make this better

// Define a simple in-memory "database" of users for testing
const testUsers = {
  "liam": "password",
  "finn": "password",
  // Add as many test users as you like
};
app.post('/login', (req, res) => {
  const { user_id, password } = req.body;

  // Check if the user_id exists in the testUsers dictionary
  if (testUsers[user_id] && testUsers[user_id] === password) {
    // Credentials are valid, generate a JWT token
    const token = jwt.sign(
      { userId: user_id }, // This is the payload, which includes the user ID
      secretKey,          // The secret key for signing the token
      { expiresIn: '1h' } // Optional: configure the expiration
    );

    res.json({
      message: "Login successful",
      token: token, // Send the generated token
      userId: user_id
    });
  } else {
    // Invalid credentials
    res.status(401).json({ error: 'Invalid user ID or password' });
  }
});

// Add this route after configuring your middleware and routes
app.get('/api/validate-token', authMiddleware, (req, res) => {
  // If the request reaches this point, the token is valid (as it passed the middleware check)
  res.json({ valid: true });
});

app.post('/api/items', (req, res) => {
  const { uuid, name, joy_percentage, len, height, weight, quantity } = req.body;
  const user_id = req.user.id; // Assuming middleware adds user details to `req.user`
  const sql = `INSERT INTO items (uuid, name, user_id, joy_percentage, len, height, weight, quantity) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [uuid, name, user_id, joy_percentage, len, height, weight, quantity], (err) => {
    if (err) {
      console.error('Error inserting into database:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Item added successfully',
      data: { uuid, name, user_id, joy_percentage, len, height, weight, quantity }
    });
  });
});

app.get('/api/items/:uuid', (req, res) => {
  const user_id = req.user.id; // Assuming middleware adds user details to `req.user`
  const sql = `SELECT * FROM items WHERE uuid = ? AND user_id = ?`;

  db.get(sql, [req.params.uuid, user_id], (err, row) => {
    if (err) {
      console.error('Error fetching item from database:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });
});

app.get('/api/requests/search', (req, res) => {
  const { column, query } = req.query;
  const user_id = req.user.id; // Assuming middleware adds user details to `req.user`
  const validColumns = ['uuid', 'name', 'joy_percentage', 'len', 'height', 'weight', 'quantity'];

  if (validColumns.includes(column)) {
    let sql = `SELECT * FROM items WHERE ${column} LIKE ? AND user_id = ?`;
    db.all(sql, [`%${query}%`, user_id], (err, rows) => {
      if (err) {
        console.error('Error searching in database:', err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  } else {
    res.status(400).json({ error: 'Invalid search parameters' });
  }
});

app.put('/api/items/:uuid', (req, res) => {
  const { name, joy_percentage, len, height, weight, quantity } = req.body;
  const user_id = req.user.id; // Assuming middleware adds user details to `req.user`
  const sql = `UPDATE items SET name = ?, joy_percentage = ?, len = ?, height = ?, weight = ?, quantity = ? WHERE uuid = ? AND user_id = ?`;

  db.run(sql, [name, joy_percentage, len, height, weight, quantity, req.params.uuid, user_id], function(err) {
    if (err) {
      console.error('Error updating item in database:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes > 0) {
      res.json({ message: 'Item updated successfully', data: { uuid: req.params.uuid, name, user_id, joy_percentage, len, height, weight, quantity } });
    } else {
      res.status(404).json({ error: 'Item not found or not yours' });
    }
  });
});

/* ROUTE DEFINITIONS END */

// Serve Vue app in production
const vueAppPath = path.join(path.resolve(), '/dist');
app.use(express.static(vueAppPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(vueAppPath, 'index.html'));
});

app.get('/api', (req, res) => {
  res.send('API Endpoint');
});

app.listen(port, host, () => {
  const localIP = getLocalIP();
  console.log(`Server running at http://${localIP}:${port}`);
});
