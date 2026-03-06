const { z } = require('zod');
const colService = require('../services/col.service');

const getColSchema = z.object({
    country: z.string().min(2),
    city: z.string().min(2)
});

const getCostOfLiving = async (req, res, next) => {
    try {
        const { country, city } = getColSchema.parse(req.query);
        const costs = await colService.getCityCosts(country, city);

        res.status(200).json({ status: 'success', data: { country, city, costs } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        next(error);
    }
};

module.exports = {
    getCostOfLiving
};
