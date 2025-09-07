# Database Setup and Data Population

## 🚀 **Overview**

This module sets up MongoDB and InfluxDB databases and populates them with realistic warehouse data for the AMR Analytics Dashboard.

## 📋 **Prerequisites**

### **1. Install MongoDB**
```bash
# Windows (using Chocolatey)
choco install mongodb

# macOS (using Homebrew)
brew install mongodb/brew/mongodb-community

# Linux (Ubuntu)
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org
```

### **2. Install InfluxDB**
```bash
# Windows
# Download from: https://portal.influxdata.com/downloads/

# macOS (using Homebrew)
brew install influxdb

# Linux (Ubuntu)
wget https://dl.influxdata.com/influxdb/releases/influxdb2-2.7.1-linux-amd64.tar.gz
tar xvzf influxdb2-2.7.1-linux-amd64.tar.gz
```

## 🔧 **Database Setup**

### **1. Start MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod --config /usr/local/etc/mongod.conf
```

### **2. Start InfluxDB**
```bash
# Windows
influxd.exe

# macOS/Linux
influxd
```

### **3. Configure InfluxDB**
1. Open browser: http://localhost:8086
2. Create organization: `warehouse-org`
3. Create bucket: `warehouse-telemetry`
4. Generate API token
5. Update `INFLUXDB_TOKEN` in environment

## 📦 **Installation**

```bash
# Navigate to data directory
cd data

# Install dependencies
npm install

# Install TypeScript globally (if not already installed)
npm install -g typescript ts-node
```

## 🚀 **Usage**

### **1. Setup and Populate Databases**
```bash
# Run the complete setup
npm run setup
```

This will:
- Connect to MongoDB and InfluxDB
- Create necessary indexes
- Generate synthetic data for one shift
- Populate both databases

### **2. Test Data Generation**
```bash
# Test the data generator
npm run test
```

### **3. Development Mode**
```bash
# Watch mode for development
npm run dev
```

## 📊 **Generated Data**

### **MongoDB Collections**
- **orders**: 200 orders with items and priorities
- **robots**: 8 robots with configuration
- **carts**: 20 carts with specifications
- **pickers**: 8 pickers with schedules

### **InfluxDB Measurements**
- **robot_telemetry**: 576 data points (8 robots × 72 time points)
- **picker_activity**: 576 data points (8 pickers × 72 time points)
- **order_events**: ~400-600 events (order lifecycle)
- **cart_movement**: 720 data points (20 carts × 36 time points)

### **Time Coverage**
- **Shift**: 8:00 AM - 2:00 PM (6 hours)
- **Robot Data**: Every 5 minutes
- **Picker Data**: Every 5 minutes
- **Cart Data**: Every 10 minutes
- **Order Events**: Event-driven

## 🔍 **Data Verification**

### **MongoDB Verification**
```bash
# Connect to MongoDB
mongosh

# Use warehouse database
use warehouse_analytics

# Check collections
show collections

# Count documents
db.orders.countDocuments()
db.robots.countDocuments()
db.carts.countDocuments()
db.pickers.countDocuments()
```

### **InfluxDB Verification**
```bash
# Connect to InfluxDB CLI
influx

# Use warehouse bucket
use warehouse-telemetry

# Check measurements
show measurements

# Count data points
from(bucket: "warehouse-telemetry")
  |> range(start: -24h)
  |> count()
```

## 📈 **Dashboard Integration**

### **Data Service Usage**
```typescript
import { DataService } from './dataService';

const dataService = new DataService();

// Connect to databases
await dataService.connect();

// Get dashboard data
const dashboardData = await dataService.getDashboardData();

// Get metrics
const metrics = await dataService.getDashboardMetrics();

// Get real-time data
const realTimeData = await dataService.getRealTimeData();

// Disconnect
await dataService.disconnect();
```

## 🧹 **Cleanup**

### **Clear All Data**
```typescript
import { DatabaseManager } from './databaseSetup';

const dbManager = new DatabaseManager();
await dbManager.connectMongoDB();
await dbManager.connectInfluxDB();
await dbManager.cleanupDatabases();
await dbManager.disconnect();
```

### **Reset Specific Collections**
```bash
# MongoDB
mongosh warehouse_analytics
db.orders.deleteMany({})
db.robots.deleteMany({})
db.carts.deleteMany({})
db.pickers.deleteMany({})

# InfluxDB
influx delete --bucket warehouse-telemetry --start 1970-01-01T00:00:00Z --stop $(date -u +%Y-%m-%dT%H:%M:%SZ)
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=warehouse_analytics

# InfluxDB
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-token-here
INFLUXDB_ORG=warehouse-org
INFLUXDB_BUCKET=warehouse-telemetry
```

### **Database Configuration**
```typescript
// data/databaseConfig.ts
export const DATABASE_CONFIG = {
  mongodb: {
    uri: 'mongodb://localhost:27017',
    database: 'warehouse_analytics',
    collections: {
      orders: 'orders',
      robots: 'robots',
      carts: 'carts',
      pickers: 'pickers'
    }
  },
  influxdb: {
    url: 'http://localhost:8086',
    token: 'your-token-here',
    org: 'warehouse-org',
    bucket: 'warehouse-telemetry',
    measurements: {
      robotTelemetry: 'robot_telemetry',
      pickerActivity: 'picker_activity',
      orderEvents: 'order_events',
      cartMovement: 'cart_movement'
    }
  }
};
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **MongoDB Connection Failed**
   - Check if MongoDB service is running
   - Verify connection string
   - Check firewall settings

2. **InfluxDB Connection Failed**
   - Check if InfluxDB service is running
   - Verify URL and port
   - Check API token validity

3. **Data Not Inserted**
   - Check database permissions
   - Verify collection names
   - Check data format

4. **Performance Issues**
   - Check database indexes
   - Monitor memory usage
   - Optimize queries

### **Logs and Debugging**
```typescript
// Enable debug logging
process.env.LOG_LEVEL = 'debug';

// Check connection status
console.log('MongoDB connected:', dbManager.mongoClient?.isConnected());
console.log('InfluxDB connected:', dbManager.influxDB ? 'Yes' : 'No');
```

## ✅ **Success Indicators**

When setup is successful, you should see:
```
🚀 Starting database setup and population...
==========================================
🔌 Connecting to MongoDB...
✅ MongoDB connected successfully
🔌 Connecting to InfluxDB...
✅ InfluxDB connected successfully
📋 Creating MongoDB indexes...
✅ MongoDB indexes created
✅ Database setup completed

🧹 Cleaning existing data...
✅ MongoDB collections cleared
✅ InfluxDB measurements cleared

📊 Populating databases...
🤖 Inserted 8 robots into MongoDB
👥 Inserted 8 pickers into MongoDB
🛒 Inserted 20 carts into MongoDB
📦 Inserted 200 orders into MongoDB
📊 Inserted 576 robot telemetry points into InfluxDB
📊 Inserted 576 picker activity points into InfluxDB
📊 Inserted 450 order events into InfluxDB
📊 Inserted 720 cart movement points into InfluxDB
✅ Database population completed

✅ Database setup and population completed successfully!
```

## 🎯 **Next Steps**

1. **Verify Data**: Check that all data is properly inserted
2. **Test Queries**: Run sample queries to ensure data retrieval works
3. **Dashboard Integration**: Connect the data service to your frontend
4. **Real-time Updates**: Implement real-time data streaming
5. **Analytics**: Add trend analysis and predictive models

Your databases are now ready to feed the AMR Analytics Dashboard with realistic warehouse data!
