const { z } = require('zod');
const compareService = require('../services/compare.service');

const compareSchema = z.object({
    scenarioIds: z.array(z.string().uuid()).min(2).max(5)
});

const executeCompare = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { scenarioIds } = compareSchema.parse(req.body);

        const results = await compareService.compareScenarios(userId, scenarioIds);
        res.status(200).json({ status: 'success', data: { results } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        if (error.message.includes('requires an active PRO')) {
            return res.status(403).json({ status: 'fail', message: error.message });
        }
        if (error.message.includes('not found')) {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

module.exports = {
    executeCompare
};
