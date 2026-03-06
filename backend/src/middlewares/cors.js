const cors = require('cors');
const { env } = require('../config/env');

const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());

const corsOptions = {
    origin: (origin, callback) => {
        // Permitir requests sem origin (como Postman ou Mobile Apps) em dev
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

module.exports = cors(corsOptions);
