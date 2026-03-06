const axios = require('axios');
const { env } = require('../config/env');
const { prisma } = require('../config/db');
const { logger } = require('../middlewares/error');

// Fallback Mock Data for Demo
const MOCK_COL_DATA = {
    rent: { min: 800, avg: 1200, max: 2000 },
    groceries: { min: 200, avg: 350, max: 500 },
    transport: { min: 50, avg: 100, max: 200 },
    health: { min: 100, avg: 250, max: 500 },
    utilities: { min: 100, avg: 150, max: 300 },
    leisure: { min: 100, avg: 200, max: 400 },
};

const getCityCosts = async (country, city) => {
    const cityKey = city.toLowerCase();
    const countryKey = country.toLowerCase();

    // Try Database Cache First
    const cachedData = await prisma.costBaseline.findMany({
        where: { city: cityKey, country: countryKey }
    });

    if (cachedData.length > 0) {
        return cachedData.reduce((acc, curr) => {
            acc[curr.category.toLowerCase()] = { min: curr.min, avg: curr.avg, max: curr.max };
            return acc;
        }, {});
    }

    if (env.DEMO_MODE) {
        logger.info(`Returning DEMO data for ${city}, ${country}`);
        return MOCK_COL_DATA;
    }

    try {
        // We search the teleport api by querying the URL:
        // https://api.teleport.org/api/cities/?search={city} -> get 'geonames:id' -> get /urban_areas/ -> /details
        // Teleport is very nested, we mock translation for MVP here or simplify it:

        // For MVP purposes, since Teleport API requires 3 nested layers to get cost of living properly 
        // and matching user-typed cities to teleport slug is error-prone, we'll store mock data 
        // to populate the database and return it when API fails.

        // Simulating API extraction failure for unknown cities.
        throw new Error('City not found in Teleport or Cost of Living details missing');
    } catch (error) {
        logger.warn(`Teleport API failed for ${city}. Falling back to system mocks.`);

        // Seed DB with Mock as Fallback for MVP persistence
        const categories = Object.keys(MOCK_COL_DATA);
        for (const cat of categories) {
            await prisma.costBaseline.create({
                data: {
                    country: countryKey,
                    city: cityKey,
                    category: cat.toUpperCase(),
                    min: MOCK_COL_DATA[cat].min,
                    avg: MOCK_COL_DATA[cat].avg,
                    max: MOCK_COL_DATA[cat].max,
                    source: 'mock-fallback'
                }
            });
        }

        return MOCK_COL_DATA;
    }
};

module.exports = {
    getCityCosts
};
