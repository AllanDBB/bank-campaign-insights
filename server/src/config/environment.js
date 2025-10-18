import dotenv from 'dotenv';

dotenv.config();

const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/banking_dashboard'
  },
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  }
};

export default config;
