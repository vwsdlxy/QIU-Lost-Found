const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// GET statistics
router.get('/stats', itemController.getStats);

// GET all items
router.get('/', itemController.getAllItems);

// GET items by category
router.get('/category/:category', itemController.getItemsByCategory);

// GET single item
router.get('/:id', itemController.getItem);

// POST create item
router.post('/', itemController.createItem);

// PUT update item
router.put('/:id', itemController.updateItem);

// PATCH update item status
router.patch('/:id/status', itemController.updateItemStatus);

// DELETE item
router.delete('/:id', itemController.deleteItem);

module.exports = router;