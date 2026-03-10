const { Router } = require('express');
const affiliateController = require('../controllers/affiliate.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

// Public route for tracking clicks
router.post('/click', affiliateController.logClick);

// Protected routes
router.use(authMiddleware);
router.get('/dashboard', affiliateController.getDashboard);
router.post('/activate', affiliateController.activateAffiliate);
router.put('/pix', affiliateController.updatePixKey);
router.post('/payout', affiliateController.requestPayout);

module.exports = router;
