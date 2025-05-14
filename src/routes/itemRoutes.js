const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /api/items - Récupérer tous les items
router.get('/', async (req, res) => {
  try {
    const items = await Item.getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des items' });
  }
});

// GET /api/items/:id - Récupérer un item par son ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item non trouvé' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'item' });
  }
});

// POST /api/items - Créer un nouvel item
router.post('/', async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'item' });
  }
});

// PUT /api/items/:id - Mettre à jour un item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.update(req.params.id, req.body);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'item' });
  }
});

// DELETE /api/items/:id - Supprimer un item
router.delete('/:id', async (req, res) => {
  try {
    await Item.delete(req.params.id);
    res.json({ message: 'Item supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'item' });
  }
});

module.exports = router;
