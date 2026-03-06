const { prisma } = require('../config/db');

const getChecklistForScenario = async (userId, scenarioId) => {
    // First, verify the scenario belongs to the user
    const scenario = await prisma.scenario.findFirst({
        where: { id: scenarioId, userId }
    });

    if (!scenario) {
        throw new Error('Scenario not found or access denied');
    }

    return await prisma.checklistItem.findMany({
        where: { scenarioId },
        orderBy: { dueDate: 'asc' }
    });
};

const createChecklistItem = async (userId, scenarioId, data) => {
    const scenario = await prisma.scenario.findFirst({
        where: { id: scenarioId, userId }
    });

    if (!scenario) {
        throw new Error('Scenario not found or access denied');
    }

    return await prisma.checklistItem.create({
        data: {
            ...data,
            scenarioId
        }
    });
};

const updateChecklistItem = async (userId, itemId, data) => {
    // Fetch item and its scenario to verify ownership conceptually
    const item = await prisma.checklistItem.findUnique({
        where: { id: itemId },
        include: { scenario: true }
    });

    if (!item || item.scenario.userId !== userId) {
        throw new Error('Checklist item not found or access denied');
    }

    return await prisma.checklistItem.update({
        where: { id: itemId },
        data
    });
};

const deleteChecklistItem = async (userId, itemId) => {
    const item = await prisma.checklistItem.findUnique({
        where: { id: itemId },
        include: { scenario: true }
    });

    if (!item || item.scenario.userId !== userId) {
        throw new Error('Checklist item not found or access denied');
    }

    return await prisma.checklistItem.delete({
        where: { id: itemId }
    });
};

module.exports = {
    getChecklistForScenario,
    createChecklistItem,
    updateChecklistItem,
    deleteChecklistItem
};
