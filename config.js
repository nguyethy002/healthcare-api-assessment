// Load environment variables
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
}

module.exports = {
  API_KEY: process.env.API_KEY,
  BASE_URL: process.env.BASE_URL || 'https://assessment.ksensetech.com/api',
  DEFAULT_LIMIT: parseInt(process.env.DEFAULT_LIMIT) || 5,
  MAX_LIMIT: parseInt(process.env.MAX_LIMIT) || 20
}; 