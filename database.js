const Database = require('better-sqlite3');
const path = require('path');

let db = null;

function getDatabase() {
  if (!db) {
    db = new Database(path.join(__dirname, 'treasure-hunt.db'));
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function initDatabase() {
  const db = getDatabase();
  
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      full_name TEXT NOT NULL,
      password TEXT NOT NULL,
      phone TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      attempt_count INTEGER DEFAULT 0,
      flag_count INTEGER DEFAULT 0,
      last_flag_type TEXT,
      last_flag_time TEXT,
      perfect_score_achieved INTEGER DEFAULT 0,
      completed_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create attempts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      time_spent INTEGER,
      answers TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  // Create index for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON attempts(user_id);
  `);
  
  console.log('✅ Database initialized successfully');
}

module.exports = {
  getDatabase,
  initDatabase
};
