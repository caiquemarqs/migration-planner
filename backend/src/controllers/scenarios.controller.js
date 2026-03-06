const { z } = require('zod');
const scenariosService = require('../services/scenarios.service');

const scenarioSchema = z.object({
    name: z.string().min(3).optional(),
    targetCountry: z.string().min(2),
    targetCity: z.string().min(2),
    targetDate: z.string().optional(),
    budgetCap: z.coerce.number().nonnegative().optional(),

    // Fallbacks for older structure if needed
    originCountry: z.string().optional(),
    destCountry: z.string().optional(),
    destCity: z.string().optional(),
    currency: z.string().length(3).optional(),
    savingsBRL: z.number().nonnegative().optional(),
    incomeBRL: z.number().nonnegative().optional(),
    costBand: z.enum(['LOW', 'MID', 'HIGH']).optional(),
    bufferPercent: z.number().min(0).max(100).optional(),
});

const createScenario = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const validatedData = scenarioSchema.parse(req.body);
        const scenario = await scenariosService.createScenario(userId, validatedData);

        res.status(201).json({ status: 'success', data: { scenario } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        next(error);
    }
};

const getScenarios = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const scenarios = await scenariosService.getScenarios(userId);

        res.status(200).json({ status: 'success', data: { scenarios } });
    } catch (error) {
        next(error);
    }
};

const getScenarioById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const scenario = await scenariosService.getScenarioById(userId, id);

        res.status(200).json({ status: 'success', data: { scenario } });
    } catch (error) {
        if (error.message === 'Scenario not found') {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const updateScenario = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const validatedData = scenarioSchema.partial().parse(req.body);
        const scenario = await scenariosService.updateScenario(userId, id, validatedData);

        res.status(200).json({ status: 'success', data: { scenario } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        if (error.message === 'Scenario not found') {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const deleteScenario = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await scenariosService.deleteScenario(userId, id);

        res.status(204).send();
    } catch (error) {
        if (error.message === 'Scenario not found') {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

module.exports = {
    createScenario,
    getScenarios,
    getScenarioById,
    updateScenario,
    deleteScenario,
};
