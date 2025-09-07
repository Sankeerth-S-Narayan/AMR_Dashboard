#!/usr/bin/env node

import { DatabaseManager } from './databaseSetup';
import { DataService } from './dataService';
import { DATABASE_CONFIG } from './databaseConfig';

// ===== COMMAND LINE INTERFACE =====

class DatabaseCLI {
  private dbManager: DatabaseManager;
  private dataService: DataService;

  constructor() {
    this.dbManager = new DatabaseManager(DATABASE_CONFIG);
    this.dataService = new DataService();
  }

  async run() {
    const command = process.argv[2];
    
    switch (command) {
      case 'setup':
        await this.setup();
        break;
      case 'populate':
        await this.populate();
        break;
      case 'cleanup':
        await this.cleanup();
        break;
      case 'status':
        await this.status();
        break;
      case 'test':
        await this.test();
        break;
      case 'help':
        this.help();
        break;
      default:
        console.log('❌ Unknown command. Use "help" for available commands.');
        process.exit(1);
    }
  }

  async setup() {
    console.log('🚀 Setting up databases...');
    try {
      await this.dbManager.setupDatabases();
      console.log('✅ Database setup completed successfully!');
    } catch (error) {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    } finally {
      await this.dbManager.disconnect();
    }
  }

  async populate() {
    console.log('📊 Populating databases with synthetic data...');
    try {
      await this.dbManager.connectMongoDB();
      await this.dbManager.connectInfluxDB();
      await this.dbManager.populateDatabases();
      console.log('✅ Database population completed successfully!');
    } catch (error) {
      console.error('❌ Population failed:', error);
      process.exit(1);
    } finally {
      await this.dbManager.disconnect();
    }
  }

  async cleanup() {
    console.log('🧹 Cleaning up databases...');
    try {
      await this.dbManager.connectMongoDB();
      await this.dbManager.connectInfluxDB();
      await this.dbManager.cleanupDatabases();
      console.log('✅ Database cleanup completed successfully!');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      process.exit(1);
    } finally {
      await this.dbManager.disconnect();
    }
  }

  async status() {
    console.log('📊 Checking database status...');
    try {
      await this.dataService.connect();
      
      // Check MongoDB
      const robots = await this.dataService.getRobots();
      const pickers = await this.dataService.getPickers();
      const carts = await this.dataService.getCarts();
      const orders = await this.dataService.getOrders();
      
      console.log('\n📦 MongoDB Status:');
      console.log(`  Robots: ${robots.length}`);
      console.log(`  Pickers: ${pickers.length}`);
      console.log(`  Carts: ${carts.length}`);
      console.log(`  Orders: ${orders.length}`);
      
      // Check InfluxDB
      const robotTelemetry = await this.dataService.getLatestRobotTelemetry();
      const pickerActivity = await this.dataService.getLatestPickerActivity();
      const orderEvents = await this.dataService.getLatestOrderEvents();
      const cartMovement = await this.dataService.getLatestCartMovement();
      
      console.log('\n📊 InfluxDB Status:');
      console.log(`  Robot Telemetry: ${robotTelemetry.length} latest points`);
      console.log(`  Picker Activity: ${pickerActivity.length} latest points`);
      console.log(`  Order Events: ${orderEvents.length} latest points`);
      console.log(`  Cart Movement: ${cartMovement.length} latest points`);
      
      // Get real-time metrics
      const realTimeData = await this.dataService.getRealTimeData();
      console.log('\n⚡ Real-time Metrics:');
      console.log(`  Active Robots: ${realTimeData.activeRobots}/8`);
      console.log(`  Active Pickers: ${realTimeData.activePickers}/8`);
      console.log(`  Carts in Use: ${realTimeData.cartsInUse}/20`);
      console.log(`  Completed Orders: ${realTimeData.completedOrders}`);
      console.log(`  Pending Orders: ${realTimeData.pendingOrders}`);
      console.log(`  Pickers on Break: ${realTimeData.pickersOnBreak}`);
      
    } catch (error) {
      console.error('❌ Status check failed:', error);
      process.exit(1);
    } finally {
      await this.dataService.disconnect();
    }
  }

  async test() {
    console.log('🧪 Testing data generation...');
    try {
      const { testShiftDataGeneration } = await import('./testDataGeneration');
      await testShiftDataGeneration();
    } catch (error) {
      console.error('❌ Test failed:', error);
      process.exit(1);
    }
  }

  help() {
    console.log(`
🚀 AMR Analytics Database CLI
============================

Available commands:

  setup     - Setup databases and create indexes
  populate  - Populate databases with synthetic data
  cleanup   - Clear all data from databases
  status    - Check database status and metrics
  test      - Test data generation
  help      - Show this help message

Examples:
  npm run cli setup
  npm run cli populate
  npm run cli status
  npm run cli cleanup

📊 Generated Data:
  - 8 Robots with telemetry data
  - 8 Pickers with activity data
  - 20 Carts with movement data
  - 200 Orders with event data
  - 2,500+ time-series data points
  - Shift: 8:00 AM - 2:00 PM
  - Picker break: 11:30 AM - 12:30 PM
`);
  }
}

// ===== MAIN EXECUTION =====

if (require.main === module) {
  const cli = new DatabaseCLI();
  cli.run()
    .then(() => {
      console.log('\n🎉 Command completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Command failed:', error);
      process.exit(1);
    });
}

export { DatabaseCLI };
