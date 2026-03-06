const express = require('express');
const helmet = require('helmet');
const { env } = require('./config/env');
const corsMiddleware = require('./middlewares/cors');
const { errorHandler } = require('./middlewares/error');
const routes = require('./routes');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(corsMiddleware);
app.use(express.urlencoded({ extended: true }));

// Demo mode middleware (inject mock data / bypass APIs if DEMO_MODE=true)
app.use((req, res, next) => {
  req.isDemo = env.DEMO_MODE;
  if (req.isDemo) {
    res.set('X-Demo-Mode', 'true');
  }
  next();
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ status: 'error', message: 'Endpoint not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
