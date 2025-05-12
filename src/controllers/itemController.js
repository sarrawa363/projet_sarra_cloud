const Item = require('../models/itemModel');

// Récupérer tous les items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.getAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des items', error: error.message });
  }
};

// Récupérer un item par son ID
exports.getItemById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await Item.getById(id);
    
    if (!item) {
      return res.status(404).json({ message: `Item avec l'ID ${id} non trouvé` });
    }
    
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'item', error: error.message });
  }
};

// Créer un nouvel item
exports.createItem = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Le nom de l\'item est requis' });
    }
    
    const newItem = await Item.create({ name, description });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'item', error: error.message });
  }
};

// Mettre à jour un item
exports.updateItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Le nom de l\'item est requis' });
    }
    
    const updatedItem = await Item.update(id, { name, description });
    
    if (!updatedItem) {
      return res.status(404).json({ message: `Item avec l'ID ${id} non trouvé` });
    }
    
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'item', error: error.message });
  }
};

// Supprimer un item
exports.deleteItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedItem = await Item.delete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: `Item avec l'ID ${id} non trouvé` });
    }
    
    res.status(200).json({ message: 'Item supprimé avec succès', data: deletedItem });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'item', error: error.message });
  }
};