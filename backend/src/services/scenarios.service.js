const { prisma } = require('../config/db');

const createScenario = async (userId, data) => {
    return await prisma.scenario.create({
        data: {
            ...data,
            userId,
        },
    });
};

const getScenarios = async (userId) => {
    return await prisma.scenario.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
};

const getScenarioById = async (userId, scenarioId) => {
    const scenario = await prisma.scenario.findFirst({
        where: { id: scenarioId, userId },
        include: {
            overrides: true,
            checklist: true,
        }
    });

    if (!scenario) {
        throw new Error('Scenario not found');
    }

    return scenario;
};

const updateScenario = async (userId, scenarioId, data) => {
    const scenario = await prisma.scenario.findFirst({
        where: { id: scenarioId, userId },
    });

    if (!scenario) {
        throw new Error('Scenario not found');
    }

    return await prisma.scenario.update({
        where: { id: scenarioId },
        data,
    });
};

const deleteScenario = async (userId, scenarioId) => {
    const scenario = await prisma.scenario.findFirst({
        where: { id: scenarioId, userId },
    });

    if (!scenario) {
        throw new Error('Scenario not found');
    }

    return await prisma.scenario.delete({
        where: { id: scenarioId },
    });
};

module.exports = {
    createScenario,
    getScenarios,
    getScenarioById,
    updateScenario,
    deleteScenario,
};
