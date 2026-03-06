const { Router } = require('express');
const { prisma } = require('../config/db');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        // Basic test query
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            db: 'connected'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
