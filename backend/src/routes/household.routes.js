const { Router } = require('express');
const householdController = require('../controllers/household.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

router.use(authMiddleware);

router.post('/', householdController.addMember);
router.get('/', householdController.getMembers);
router.put('/:id', householdController.updateMember);
router.delete('/:id', householdController.deleteMember);

module.exports = router;
