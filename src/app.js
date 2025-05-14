
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { initDb, db } = require('./config/db');

// Routes API personnalisées
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// API : Liste des items
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des items:', err.message);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(rows);
    }
  });
});

// API : Ajouter un item
app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  db.run('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], function(err) {
    if (err) {
      console.error('Erreur lors de l’ajout de l’item:', err.message);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.status(201).json({ id: this.lastID, name, description });
    }
  });
});

// Page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Vérification de l’état de l’API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Lancement du serveur
const startServer = async () => {
  initDb();
  app.listen(PORT, () => {
    console.log(`✅ Serveur en ligne sur le port ${PORT}`);
  });
};

startServer();

module.exports = app;
