const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roles');

// GET all roles
router.get('/', roleController.getAll);

// GET role by ID
router.get('/:id', roleController.getById);

// POST create new role
router.post('/', roleController.create);

// PUT update role
router.put('/:id', roleController.update);

// DELETE role
router.delete('/:id', roleController.delete);

module.exports = router;