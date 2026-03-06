const { Router } = require('express');
const colController = require('../controllers/col.controller');

const router = Router();

// COL is open to ease frontend integration in the MVP
router.get('/', colController.getCostOfLiving);

module.exports = router;
