const billingService = require('../services/billing.service');

const createStripeCheckout = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { planKey } = req.body; // e.g 'PRO' or 'LIFETIME'

        const session = await billingService.createCheckoutSession(userId, planKey);
        res.status(200).json({ status: 'success', data: { url: session.url } });
    } catch (error) {
        next(error);
    }
};

const getSubscription = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const subscription = await billingService.getUserSubscription(userId);

        res.status(200).json({ status: 'success', data: { subscription } });
    } catch (error) {
        next(error);
    }
};

// Stripe requires the raw body, so we will use express.raw middlewares in the route
const handleWebhook = async (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    try {
        await billingService.handleStripeWebhook(signature, req.body);
        res.status(200).send('Webhook received!');
    } catch (error) {
        res.status(400).send(`Webhook error: ${error.message}`);
    }
};

module.exports = {
    createStripeCheckout,
    getSubscription,
    handleWebhook
};
