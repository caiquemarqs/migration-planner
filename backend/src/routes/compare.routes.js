const { Router } = require('express');
const compareController = require('../controllers/compare.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

router.use(authMiddleware);

// POST explicitly to allow sending an array of Scenario IDs in the body
router.post('/', compareController.executeCompare);

module.exports = router;
