// ===== ENVIRONMENT CONFIGURATION =====

export const ENVIRONMENT_CONFIG = {
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    database: process.env.MONGODB_DATABASE || 'warehouse_analytics'
  },
  
  // InfluxDB Configuration
  influxdb: {
    url: process.env.INFLUXDB_URL || 'http://localhost:8086',
    token: process.env.INFLUXDB_TOKEN || 'your-influxdb-token-here',
    org: process.env.INFLUXDB_ORG || 'warehouse-org',
    bucket: process.env.INFLUXDB_BUCKET || 'warehouse-telemetry'
  },
  
  // Application Configuration
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info'
  }
};

// ===== DATABASE SETUP INSTRUCTIONS =====

export const SETUP_INSTRUCTIONS = `
🚀 AMR Analytics Database Setup Instructions
==========================================

📋 Prerequisites:
1. Install MongoDB (https://www.mongodb.com/try/download/community)
2. Install InfluxDB (https://portal.influxdata.com/downloads/)

🔧 MongoDB Setup:
1. Start MongoDB service
2. Create database: warehouse_analytics
3. Default connection: mongodb://localhost:27017

🔧 InfluxDB Setup:
1. Start InfluxDB service
2. Create organization: warehouse-org
3. Create bucket: warehouse-telemetry
4. Generate API token
5. Update INFLUXDB_TOKEN in environment

📦 Install Dependencies:
npm install

🚀 Run Database Setup:
npm run setup

🧪 Test Data Generation:
npm run test

📊 Data Generated:
- 8 Robots with telemetry data
- 8 Pickers with activity data  
- 20 Carts with movement data
- 200 Orders with event data
- 2,500+ time-series data points
- Shift: 8:00 AM - 2:00 PM
- Picker break: 11:30 AM - 12:30 PM

✅ Ready for Dashboard Integration!
`;

console.log(SETUP_INSTRUCTIONS);
