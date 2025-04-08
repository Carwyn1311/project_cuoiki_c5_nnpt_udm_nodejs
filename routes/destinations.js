// routes/destinations.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/destinations');

// CRUD operations for destinations
router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
