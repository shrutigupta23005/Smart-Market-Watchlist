const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const { startPriceIngestion } = require('./jobs/priceIngestionJob');
const rollingStatsService = require('./jobs/rollingStatsJob');

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start background price ingestion (runs every 10 seconds)
  startPriceIngestion(10000);

  // Start background rolling statistics baseline worker (runs every 60 seconds)
  rollingStatsService.start(60000);

  app.listen(env.PORT, () => {
    console.log(`[SIGNAL Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${env.PORT}`);
    console.log(`[SIGNAL Backend] Health check: http://localhost:${env.PORT}/api/health`);
  });
};

startServer();
