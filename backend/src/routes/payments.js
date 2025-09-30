const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');
const authMiddleware = require('../middleware/auth');

// Endpoint 1: Frontend creates payment (protected)
router.post('/create', authMiddleware, paymentController.createPayment);

// Endpoint 2: PayFast sends payment result (public)
router.post('/payfast-itn', paymentController.handlePayFastITN);

module.exports = router;