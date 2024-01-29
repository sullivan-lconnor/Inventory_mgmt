const express = require('express');
const path = require('path');
const os = require('os');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const host = '0.0.0.0';

// SQLite database setup
const dbPath = path.join(__dirname, 'sample_sqlLiteDb.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database');
    db.run(`CREATE TABLE IF NOT EXISTS items (
      uuid TEXT PRIMARY KEY,
      content TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err.message);
      } else {
        console.log('Table "items" ensured');
      }
    });
  }
});

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

// Serve Vue app in production
const vueAppPath = path.join(__dirname, 'inventory_mgnmt_client/dist');
app.use(express.static(vueAppPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(vueAppPath, 'index.html'));
});


app.get('/api', (req, res) => {
  res.send('API Endpoint');
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to add an item
app.post('/api/items', (req, res) => {
  console.log('Received POST request on /api/items:', req.body); // Log incoming request

  const { uuid, content } = req.body;
  const sql = `INSERT INTO items (uuid, content) VALUES (?, ?)`;
  db.run(sql, [uuid, content], (err) => {
    if (err) {
      console.error('Error inserting into database:', err.message); // Log any errors
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Item added successfully:', { uuid, content }); // Log success
    res.json({ message: 'Item added successfully', uuid, content });
  });
});

// Route to get all items
app.get('/api/items', (req, res) => {
  console.log('Received GET request on /api/items'); // Log incoming request

  const sql = `SELECT * FROM items`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching from database:', err.message); // Log any errors
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Items retrieved:', rows); // Log fetched data
    res.json(rows);
  });
});

// // Route to get a single item by UUID
// app.get('/api/items/:uuid', (req, res) => {
//   console.log('Received GET request for an item with UUID:', req.params.uuid); // Log incoming request

//   const sql = `SELECT * FROM items WHERE uuid = ?`;
//   const uuid = req.params.uuid;
//   db.get(sql, [uuid], (err, row) => {
//     if (err) {
//       console.error('Error fetching item from database:', err.message); // Log any errors
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     if (row) {
//       console.log('Item retrieved:', row); // Log fetched data
//       res.json(row);
//     } else {
//       res.status(404).json({ error: 'Item not found' });
//     }
//   });
// });

app.listen(port, host, () => {
  const localIP = getLocalIP();
  console.log(`Server running at http://${localIP}:${port}`);
});
