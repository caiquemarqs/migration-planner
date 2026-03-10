const { prisma } = require('../config/db');

const getDashboard = async (userId) => {
    let affiliate = await prisma.affiliate.findUnique({
        where: { userId },
        include: {
            _count: {
                select: { clicks: true, conversions: true }
            }
        }
    });

    if (!affiliate) {
        throw new Error('Affiliate profile not found');
    }

    return affiliate;
};

const activateAffiliate = async (userId) => {
    const existing = await prisma.affiliate.findUnique({ where: { userId } });
    if (existing) {
        throw new Error('Already an affiliate');
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return await prisma.affiliate.create({
        data: {
            userId,
            code,
            status: 'ACTIVE'
        }
    });
};

const updatePixKey = async (userId, pixKey) => {
    const affiliate = await prisma.affiliate.findUnique({ where: { userId } });
    if (!affiliate) throw new Error('Affiliate profile not found');

    return await prisma.affiliate.update({
        where: { id: affiliate.id },
        data: { pixKey }
    });
};

const requestPayout = async (userId, amount) => {
    const affiliate = await prisma.affiliate.findUnique({ where: { userId } });
    if (!affiliate) throw new Error('Affiliate profile not found');
    if (!affiliate.pixKey) throw new Error('PIX Key is required to request payout');
    if (affiliate.balance < amount) throw new Error('Insufficient balance');
    if (amount <= 0) throw new Error('Invalid amount');

    // Start transaction
    return await prisma.$transaction(async (tx) => {
        // Deduct balance
        await tx.affiliate.update({
            where: { id: affiliate.id },
            data: { balance: { decrement: amount } }
        });

        // Create payout record
        return await tx.affiliatePayout.create({
            data: {
                affiliateId: affiliate.id,
                amount,
                pixKey: affiliate.pixKey,
                status: 'PENDING'
            }
        });
    });
};

const logClick = async (code, reqData) => {
    const affiliate = await prisma.affiliate.findUnique({ where: { code } });
    if (!affiliate) return null; // Ignore invalid codes silently for tracking

    return await prisma.affiliateClick.create({
        data: {
            affiliateId: affiliate.id,
            ipAddress: reqData.ipAddress,
            userAgent: reqData.userAgent,
            utmSource: reqData.utmSource,
            utmMedium: reqData.utmMedium,
            utmCampaign: reqData.utmCampaign,
        }
    });
};

module.exports = {
    getDashboard,
    activateAffiliate,
    updatePixKey,
    requestPayout,
    logClick
};
