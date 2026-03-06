const express = require('express');
const { Router } = require('express');
const billingController = require('../controllers/billing.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

// Webhook for Stripe (Must be raw body to verify signature)
router.post('/webhook', express.raw({ type: 'application/json' }), billingController.handleWebhook);

// Protected Routes
router.use(authMiddleware);
router.post('/checkout', billingController.createStripeCheckout);
router.get('/subscription', billingController.getSubscription);

module.exports = router;
