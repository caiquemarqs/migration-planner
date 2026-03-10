const { Router } = require('express');

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const scenariosRoutes = require('./scenarios.routes');
const colRoutes = require('./col.routes');
const fxRoutes = require('./fx.routes');
const compareRoutes = require('./compare.routes');
const checklistRoutes = require('./checklist.routes');
const billingRoutes = require('./billing.routes');
const householdRoutes = require('./household.routes');
const transactionsRoutes = require('./transactions.routes');
const affiliatesRoutes = require('./affiliate.routes');

const router = Router();

router.use('/health', healthRoutes);

// Register future routes here
router.use('/billing', billingRoutes);

// Apply json middleware for all the other routes
const express = require('express');
router.use(express.json());

router.use('/auth', authRoutes);
router.use('/users', require('./users.routes'));
router.use('/scenarios', scenariosRoutes);
router.use('/col', colRoutes);
router.use('/fx', fxRoutes);
router.use('/compare', compareRoutes);
router.use('/checklist', checklistRoutes);
router.use('/household', householdRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/affiliate', affiliatesRoutes);
// router.use('/billing', billingRoutes);

module.exports = router;
