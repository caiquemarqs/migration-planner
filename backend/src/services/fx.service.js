const axios = require('axios');
const { env } = require('../config/env');
const { prisma } = require('../config/db');

// In production, we should try to use Redis. 
// For this MVP, we will rely on a database backup + API call.
const getExchangeRate = async (base, target) => {
    const asOfToday = new Date();
    asOfToday.setHours(0, 0, 0, 0);

    // Check if we already have it in DB for today
    const cachedRate = await prisma.fxRate.findFirst({
        where: {
            base,
            target,
            asOf: { gte: asOfToday }
        }
    });

    if (cachedRate) return cachedRate.rate;

    if (env.DEMO_MODE) {
        // Return a dummy rate for BRL -> USD or EUR
        const dummyRates = { 'BRL-USD': 5.0, 'BRL-EUR': 5.5, 'USD-BRL': 0.2, 'EUR-BRL': 0.18 };
        return dummyRates[`${base}-${target}`] || 1.0;
    }

    try {
        // Calling external API
        const response = await axios.get(`${env.FX_API_BASE}/latest?base=${base}&symbols=${target}`);
        const rate = response.data.rates[target];

        if (!rate) throw new Error('Rate not found in provider');

        // Save to DB for caching
        await prisma.fxRate.create({
            data: {
                base,
                target,
                rate,
                asOf: new Date(),
                source: 'exchangerate.host'
            }
        });

        return rate;
    } catch (error) {
        // Fallback to the latest known rate from DB if API fails
        const lastKnown = await prisma.fxRate.findFirst({
            where: { base, target },
            orderBy: { asOf: 'desc' }
        });

        if (lastKnown) return lastKnown.rate;
        throw new Error('Exchange rate API unavailable and no historical data found');
    }
};

module.exports = {
    getExchangeRate
};
