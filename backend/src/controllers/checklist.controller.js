const { z } = require('zod');
const checklistService = require('../services/checklist.service');

const checklistItemSchema = z.object({
    title: z.string().min(2),
    dueDate: z.string().datetime().optional().nullable(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional()
});

const getChecklistForScenario = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { scenarioId } = req.params;
        const items = await checklistService.getChecklistForScenario(userId, scenarioId);

        res.status(200).json({ status: 'success', data: { items } });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const createChecklistItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { scenarioId } = req.params;
        const validatedData = checklistItemSchema.parse(req.body);

        const item = await checklistService.createChecklistItem(userId, scenarioId, validatedData);

        res.status(201).json({ status: 'success', data: { item } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        if (error.message.includes('not found')) {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const updateChecklistItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const validatedData = checklistItemSchema.partial().parse(req.body);

        const item = await checklistService.updateChecklistItem(userId, itemId, validatedData);

        res.status(200).json({ status: 'success', data: { item } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        if (error.message.includes('not found')) {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const deleteChecklistItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        await checklistService.deleteChecklistItem(userId, itemId);

        res.status(204).send();
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

module.exports = {
    getChecklistForScenario,
    createChecklistItem,
    updateChecklistItem,
    deleteChecklistItem
};
