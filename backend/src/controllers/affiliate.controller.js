const affiliateService = require('../services/affiliate.service');
const { z } = require('zod');

const updatePixSchema = z.object({
    pixKey: z.string().min(1)
});

const requestPayoutSchema = z.object({
    amount: z.number().positive()
});

const logClickSchema = z.object({
    code: z.string(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional()
});

const getDashboard = async (req, res, next) => {
    try {
        const dashboard = await affiliateService.getDashboard(req.user.id);
        res.status(200).json({ status: 'success', data: { dashboard } });
    } catch (error) {
        if (error.message === 'Affiliate profile not found') {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const activateAffiliate = async (req, res, next) => {
    try {
        const affiliate = await affiliateService.activateAffiliate(req.user.id);
        res.status(201).json({ status: 'success', data: { affiliate } });
    } catch (error) {
        if (error.message === 'Already an affiliate') {
            return res.status(400).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const updatePixKey = async (req, res, next) => {
    try {
        const { pixKey } = updatePixSchema.parse(req.body);
        const affiliate = await affiliateService.updatePixKey(req.user.id, pixKey);
        res.status(200).json({ status: 'success', data: { affiliate } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        next(error);
    }
};

const requestPayout = async (req, res, next) => {
    try {
        const { amount } = requestPayoutSchema.parse(req.body);
        const payout = await affiliateService.requestPayout(req.user.id, amount);
        res.status(201).json({ status: 'success', data: { payout } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        if (error.message === 'Affiliate profile not found' || error.message === 'PIX Key is required to request payout' || error.message === 'Insufficient balance' || error.message === 'Invalid amount') {
            return res.status(400).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const logClick = async (req, res, next) => {
    try {
        const { code, utmSource, utmMedium, utmCampaign } = logClickSchema.parse(req.body);
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        await affiliateService.logClick(code, {
            ipAddress,
            userAgent,
            utmSource,
            utmMedium,
            utmCampaign
        });

        res.status(200).json({ status: 'success' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        next(error);
    }
};

module.exports = {
    getDashboard,
    activateAffiliate,
    updatePixKey,
    requestPayout,
    logClick
};
