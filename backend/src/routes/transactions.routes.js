const { Router } = require('express');
const transactionsController = require('../controllers/transactions.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

router.use(authMiddleware);

router.post('/', transactionsController.addTransaction);
router.get('/', transactionsController.getTransactions);
router.get('/summary', transactionsController.getMonthlySummary);
router.delete('/:id', transactionsController.deleteTransaction);

module.exports = router;
