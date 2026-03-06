const pino = require('pino');

const logger = pino({
    transport: {
        target: 'pino-pretty',
    },
});

const errorHandler = (err, req, res, next) => {
    logger.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = {
    errorHandler,
    logger,
};
