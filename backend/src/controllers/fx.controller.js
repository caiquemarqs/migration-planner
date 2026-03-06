const { z } = require('zod');
const fxService = require('../services/fx.service');

const getRateSchema = z.object({
    base: z.string().length(3),
    target: z.string().length(3)
});

const getRate = async (req, res, next) => {
    try {
        const { base, target } = getRateSchema.parse(req.query);
        const rate = await fxService.getExchangeRate(base.toUpperCase(), target.toUpperCase());

        res.status(200).json({ status: 'success', data: { base, target, rate } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        next(error);
    }
};

module.exports = {
    getRate
};
