const { db } = require('../config/db');

class Item {
  // Récupérer tous les items
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM items ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
          console.error('Erreur lors de la récupération des items:', err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  // Récupérer un item par son ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error(`Erreur lors de la récupération de l'item ${id}:`, err);
          return reject(err);
        }
        resolve(row);
      });
    });
  }

  // Créer un nouvel item
  static create({ name, description }) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO items (name, description) VALUES (?, ?)';
      db.run(query, [name, description], function (err) {
        if (err) {
          console.error('Erreur lors de la création de l\'item:', err);
          return reject(err);
        }
        resolve({ id: this.lastID, name, description });
      });
    });
  }

  // Mettre à jour un item
  static update(id, { name, description }) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE items SET name = ?, description = ? WHERE id = ?';
      db.run(query, [name, description, id], function (err) {
        if (err) {
          console.error(`Erreur lors de la mise à jour de l'item ${id}:`, err);
          return reject(err);
        }
        resolve({ id, name, description });
      });
    });
  }

  // Supprimer un item
  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM items WHERE id = ?';
      db.run(query, [id], function (err) {
        if (err) {
          console.error(`Erreur lors de la suppression de l'item ${id}:`, err);
          return reject(err);
        }
        resolve({ id });
      });
    });
  }
}

module.exports = Item;
