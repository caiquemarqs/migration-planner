const { Router } = require('express');
const scenariosController = require('../controllers/scenarios.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

router.use(authMiddleware);

router.post('/', scenariosController.createScenario);
router.get('/', scenariosController.getScenarios);
router.get('/:id', scenariosController.getScenarioById);
router.patch('/:id', scenariosController.updateScenario);
router.delete('/:id', scenariosController.deleteScenario);

module.exports = router;
