const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin absolu vers la base (en mémoire ou fichier temporaire dans /tmp)
const dbPath = process.env.NODE_ENV === 'production'
  ? '/tmp/database.sqlite'  // recommandé par Render
  : path.join(__dirname, '../dev.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de l’ouverture de la base SQLite:', err.message);
  } else {
    console.log(`Connecté à la base SQLite: ${dbPath}`);
  }
});

const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `, (err) => {
      if (err) {
        console.error('Erreur lors de la création de la table:', err.message);
      } else {
        console.log('Base de données initialisée avec succès.');
      }
    });
  });
};

module.exports = { db, initDb };
