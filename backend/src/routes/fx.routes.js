const { Router } = require('express');
const fxController = require('../controllers/fx.controller');

const router = Router();

// FX is generally open to ease frontend integration in the MVP
router.get('/rate', fxController.getRate);

module.exports = router;
