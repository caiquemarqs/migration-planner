const { prisma } = require('../config/db');
const colService = require('./col.service');
const billingService = require('./billing.service');

const compareScenarios = async (userId, scenarioIds) => {
    // 1. Validate PRO/LIFETIME status to use comparator
    const sub = await billingService.getUserSubscription(userId);
    if (!sub || (sub.plan !== 'PRO' && sub.plan !== 'LIFETIME')) {
        throw new Error('This feature requires an active PRO or LIFETIME subscription');
    }

    if (!scenarioIds || scenarioIds.length < 2 || scenarioIds.length > 5) {
        throw new Error('Please select between 2 to 5 scenarios to compare');
    }

    // 2. Fetch the Scenarios
    const scenarios = await prisma.scenario.findMany({
        where: {
            id: { in: scenarioIds },
            userId: userId
        },
        include: { overrides: true }
    });

    if (scenarios.length !== scenarioIds.length) {
        throw new Error('One or more scenarios not found or do not belong to you');
    }

    // 3. Compute the cost of living data for each scenario
    const comparisonResults = await Promise.all(scenarios.map(async (scenario) => {
        // A) Get Baseline Base Costs
        const baselineCosts = await colService.getCityCosts(scenario.destCountry, scenario.destCity);

        // B) Apply User Overrides if any
        let computedMonthlyCost = 0;
        const details = {};

        // For each expected category, pick override or baseline (applying costBand)
        const categories = ['rent', 'groceries', 'transport', 'health', 'utilities', 'leisure'];

        categories.forEach(cat => {
            const override = scenario.overrides.find(o => o.category.toLowerCase() === cat);
            if (override) {
                details[cat] = { value: override.value, source: 'override', currency: override.currency };
                computedMonthlyCost += override.value; // Simplification: assuming same currency
            } else {
                const base = baselineCosts[cat];
                let val = base.avg;
                if (scenario.costBand === 'LOW') val = base.min;
                if (scenario.costBand === 'HIGH') val = base.max;

                details[cat] = { value: val, source: 'baseline', currency: 'USD' }; // Baseline usually in USD mock
                computedMonthlyCost += val;
            }
        });

        const bufferValue = computedMonthlyCost * (scenario.bufferPercent / 100);
        const totalRequired = computedMonthlyCost + bufferValue;
        const runwayMonths = scenario.savingsBRL > 0
            ? Math.floor(scenario.savingsBRL / (totalRequired * 5.0)) // Mock 5.0 Exchange rate BRL -> Base DB currency for MVP
            : 0;

        return {
            scenarioId: scenario.id,
            destination: `${scenario.destCity}, ${scenario.destCountry}`,
            currency: scenario.currency,
            baseMonthlyCost: computedMonthlyCost,
            bufferAdded: bufferValue,
            totalMonthlyRequired: totalRequired,
            estimatedRunwayMonths: runwayMonths,
            categoryDetails: details
        };
    }));

    return comparisonResults;
};

module.exports = {
    compareScenarios
};
