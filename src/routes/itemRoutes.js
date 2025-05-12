const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Route pour récupérer tous les items
router.get('/', itemController.getAllItems);

// Route pour récupérer un item par son ID
router.get('/:id', itemController.getItemById);

// Route pour créer un nouvel item
router.post('/', itemController.createItem);

// Route pour mettre à jour un item
router.put('/:id', itemController.updateItem);

// Route pour supprimer un item
router.delete('/:id', itemController.deleteItem);

module.exports = router;