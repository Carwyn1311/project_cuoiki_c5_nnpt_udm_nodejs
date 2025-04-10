const express = require('express');
const router = express.Router();
const paymentDetailsController = require('../controllers/paymentdetails');

// GET all payment details
router.get('/', paymentDetailsController.getAll);

// GET payment detail by ID
router.get('/:id', paymentDetailsController.getById);

// POST create new payment detail
router.post('/', paymentDetailsController.create);

// PUT update payment detail
router.put('/:id', paymentDetailsController.update);

// DELETE payment detail
router.delete('/:id', paymentDetailsController.deletePaymentDetail);

module.exports = router;