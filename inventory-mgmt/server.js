import express from 'express';
import path from 'path';
import os from 'os';
import { initializeDb } from './db-setup.js'; // Adjust the path as necessary

const app = express();
const port = 8080;
const host = '0.0.0.0';

// Middleware to parse JSON bodies
app.use(express.json());

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

app.post('/api/items', (req, res) => {
  const { uuid, name, joy_percentage, len, height, weight, quantity } = req.body;
  const sql = `INSERT INTO items (uuid, name, joy_percentage, len, height, weight, quantity) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [uuid, name, joy_percentage, len, height, weight, quantity], (err) => {
    if (err) {
      console.error('Error inserting into database:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Item added successfully',
      data: { uuid, name, joy_percentage, len, height, weight, quantity }
    });
  });
});

app.get('/api/items/:uuid', (req, res) => {
  const sql = `SELECT * FROM items WHERE uuid = ?`;
  db.get(sql, [req.params.uuid], (err, row) => {
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

  // Adjust this list based on the columns you want to be searchable
  const validColumns = ['uuid', 'name', 'joy_percentage', 'len', 'height', 'weight', 'quantity'];
  
  if (validColumns.includes(column)) {
    let sql = `SELECT * FROM items WHERE ${column} LIKE ?`;
    db.all(sql, [`%${query}%`], (err, rows) => {
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
  const { uuid } = req.params;
  const { name, joy_percentage, len, height, weight, quantity } = req.body;

  const sql = `UPDATE items SET name = ?, joy_percentage = ?, len = ?, height = ?, weight = ?, quantity = ? WHERE uuid = ?`;

  // Use the function callback parameters to access the result of the query
  db.run(sql, [name, joy_percentage, len, height, weight, quantity, uuid], function(err) {
    if (err) {
      console.error('Error updating item in database:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    // Access changes property correctly using "this.changes"
    if (this.changes > 0) {
      // If any row was updated, send success response
      res.json({ message: 'Item updated successfully', data: { uuid, name, joy_percentage, len, height, weight, quantity } });
    } else {
      // If no row was updated (e.g., item not found), send a not found response
      res.status(404).json({ error: 'Item not found' });
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
