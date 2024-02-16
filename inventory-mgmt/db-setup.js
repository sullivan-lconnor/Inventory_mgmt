import sqlite3 from 'sqlite3';
import path from 'path';
const { verbose } = sqlite3;
const sqlite = verbose();

export const initializeDb = () => {
  const dbPath = path.join(path.resolve(), 'rummage_sqlLiteDb.db');
  const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database', err.message);
      return;
    }
    console.log('Connected to SQLite database');
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS items (
        unique_id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL,
        name TEXT,
        joy_percentage INTEGER,
        len INTEGER,
        height REAL,
        weight REAL,
        date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
        quantity INTEGER
      )`, (err) => {
        if (err) {
          console.error('Error creating table', err.message);
        } else {
          console.log('Table "items" ensured');
        }
      });

      db.run(`CREATE TRIGGER IF NOT EXISTS update_last_modified_time
      AFTER UPDATE ON items
      FOR EACH ROW
      BEGIN
        UPDATE items SET last_modified = CURRENT_TIMESTAMP WHERE unique_id = OLD.unique_id;
      END;`, (err) => {
        if (err) {
          console.error('Error creating trigger', err.message);
        } else {
          console.log('Trigger for updating last_modified ensured');
        }
      });
    });
  });
  return db;
};