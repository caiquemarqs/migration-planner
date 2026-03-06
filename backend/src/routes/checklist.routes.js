const { Router } = require('express');
const checklistController = require('../controllers/checklist.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

router.use(authMiddleware);

// Rotas dependem de um scenarioId
router.get('/scenario/:scenarioId', checklistController.getChecklistForScenario);
router.post('/scenario/:scenarioId', checklistController.createChecklistItem);

// Rotas diretas no item
router.patch('/item/:itemId', checklistController.updateChecklistItem);
router.delete('/item/:itemId', checklistController.deleteChecklistItem);

module.exports = router;
