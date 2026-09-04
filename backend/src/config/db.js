const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} @ ${conn.connection.host}:${conn.connection.port}`);
  } catch (error) {
    console.error(`[MongoDB] Error connecting to database:`, error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
