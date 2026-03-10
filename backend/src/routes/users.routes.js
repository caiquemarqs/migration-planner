const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

router.put('/mode', authMiddleware, userController.updateMode);

module.exports = router;
