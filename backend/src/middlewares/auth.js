const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const authMiddleware = (req, res, next) => {
    // If DEMO_MODE, bypass check optionally or set a dummy user
    if (req.isDemo && req.headers['x-demo-user']) {
        req.user = { id: req.headers['x-demo-user'], role: 'USER' };
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 'error', message: 'Token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Token is expired or invalid' });
    }
};

const requireRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.status(403).json({ status: 'error', message: 'Forbidden: Insufficient permissions' });
    }
    next();
};

module.exports = {
    authMiddleware,
    requireRole,
};
