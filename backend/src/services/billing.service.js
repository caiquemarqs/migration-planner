const Stripe = require('stripe');
const { prisma } = require('../config/db');
const { env } = require('../config/env');
const { logger } = require('../middlewares/error');

const stripe = new Stripe(env.STRIPE_SECRET, { apiVersion: '2023-10-16' });

// Products Mock (you should replace with actual Stripe Price IDs from your dashboard)
const PLANS = {
    PRO: { priceId: 'price_mock_pro_monthly', planId: 'PRO' },
    LIFETIME: { priceId: 'price_mock_lifetime', planId: 'LIFETIME' }
};

const createCheckoutSession = async (userId, planKey) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const selectedPlan = PLANS[planKey];
    if (!selectedPlan) throw new Error('Invalid plan selected');

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: planKey === 'LIFETIME' ? 'payment' : 'subscription',
        line_items: [
            {
                price: selectedPlan.priceId,
                quantity: 1,
            },
        ],
        customer_email: user.email,
        client_reference_id: userId,
        metadata: {
            plan: selectedPlan.planId,
            userId: userId
        },
        success_url: `${env.ALLOWED_ORIGINS.split(',')[0]}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.ALLOWED_ORIGINS.split(',')[0]}/billing/canceled`,
    });

    return session;
};

const handleStripeWebhook = async (signature, rawBody) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        logger.error('Stripe webhook signature verification failed.', err.message);
        throw new Error(`Webhook Error: ${err.message}`);
    }

    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { userId, plan } = session.metadata;

        if (userId && plan) {
            await prisma.subscription.create({
                data: {
                    userId,
                    plan: plan,
                    provider: 'STRIPE',
                    status: 'ACTIVE',
                    extRef: session.subscription || session.payment_intent,
                    expiresAt: plan === 'LIFETIME' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days dummy
                }
            });
            logger.info(`Subscription ${plan} created for user ${userId}`);
        }
    }

    // Handle subscription cancellations
    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        await prisma.subscription.updateMany({
            where: { extRef: subscription.id },
            data: { status: 'CANCELED' }
        });
        logger.info(`Subscription ${subscription.id} canceled`);
    }

    return { received: true };
};

const getUserSubscription = async (userId) => {
    return await prisma.subscription.findFirst({
        where: { userId, status: 'ACTIVE' },
        orderBy: { startedAt: 'desc' }
    });
};

module.exports = {
    createCheckoutSession,
    handleStripeWebhook,
    getUserSubscription
};
