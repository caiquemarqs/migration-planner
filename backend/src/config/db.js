const { env } = require('./env');

let prisma;

if (env.DEMO_MODE) {
    // Mock Prisma completely for Demo Mode
    const users = [];
    const scenarios = [
        {
            id: 'demo-scenario-456',
            userId: 'demo-user-123',
            name: 'Canadá 2026',
            targetCountry: 'Canadá',
            targetCity: 'Toronto',
            targetDate: new Date(),
            budgetCap: 50000,
            createdAt: new Date(),
            overrides: [],
            checklist: []
        }
    ];

    prisma = {
        user: {
            findUnique: async ({ where }) => {
                if (where.email) return users.find(u => u.email === where.email) || null;
                if (where.id) return users.find(u => u.id === where.id) || null;
                return null;
            },
            create: async ({ data }) => {
                const newUser = { ...data, id: 'user-' + Date.now(), createdAt: new Date() };
                users.push(newUser);
                return newUser;
            },
        },
        scenario: {
            findMany: async ({ where }) => scenarios.filter(s => s.userId === where.userId),
            findFirst: async ({ where }) => scenarios.find(s => s.id === where.id && s.userId === where.userId) || null,
            create: async ({ data }) => {
                const newScenario = { ...data, id: 'scenario-' + Date.now(), createdAt: new Date(), overrides: [], checklist: [] };
                scenarios.push(newScenario);
                return newScenario;
            },
            update: async ({ where, data }) => {
                const index = scenarios.findIndex(s => s.id === where.id);
                if (index > -1) {
                    scenarios[index] = { ...scenarios[index], ...data };
                    return scenarios[index];
                }
                return null;
            },
            delete: async ({ where }) => {
                const index = scenarios.findIndex(s => s.id === where.id);
                if (index > -1) {
                    return scenarios.splice(index, 1)[0];
                }
                return null;
            },
        }
    };
} else {
    const { PrismaClient } = require('@prisma/client');
    const prismaConfig = {
        log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    };
    prisma = global.prisma || new PrismaClient(prismaConfig);
    if (env.NODE_ENV !== 'production') global.prisma = prisma;
}

module.exports = { prisma };
