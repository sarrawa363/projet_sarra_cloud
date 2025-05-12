const { pool } = require('../config/db');

class Item {
  // Récupérer tous les items
  static async getAll() {
    try {
      const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des items:', error);
      throw error;
    }
  }

  // Récupérer un item par son ID
  static async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'item ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouvel item
  static async create(item) {
    try {
      const { name, description } = item;
      const result = await pool.query(
        'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création de l\'item:', error);
      throw error;
    }
  }

  // Mettre à jour un item
  static async update(id, item) {
    try {
      const { name, description } = item;
      const result = await pool.query(
        'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        [name, description, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'item ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un item
  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'item ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Item;