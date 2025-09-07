import { DatabaseManager } from './databaseSetup';
import { DATABASE_CONFIG } from './databaseConfig';

// ===== DATABASE SETUP SCRIPT =====

async function setupAndPopulateDatabases() {
  const dbManager = new DatabaseManager(DATABASE_CONFIG);
  
  try {
    console.log('🚀 Starting database setup and population...');
    console.log('==========================================');
    
    // Step 1: Setup databases
    await dbManager.setupDatabases();
    
    // Step 2: Clean existing data (optional)
    console.log('\n🧹 Cleaning existing data...');
    await dbManager.cleanupDatabases();
    
    // Step 3: Populate with synthetic data
    console.log('\n📊 Populating databases...');
    await dbManager.populateDatabases();
    
    console.log('\n✅ Database setup and population completed successfully!');
    console.log('==========================================');
    console.log('📊 Data Summary:');
    console.log('- 8 Robots with telemetry data');
    console.log('- 8 Pickers with activity data');
    console.log('- 20 Carts with movement data');
    console.log('- 200 Orders with event data');
    console.log('- 2,500+ time-series data points');
    console.log('- Shift: 8:00 AM - 2:00 PM');
    console.log('- Picker break: 11:30 AM - 12:30 PM');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    // Disconnect from databases
    await dbManager.disconnect();
  }
}

// ===== MAIN EXECUTION =====

if (require.main === module) {
  setupAndPopulateDatabases()
    .then(() => {
      console.log('\n🎉 Database setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Database setup failed:', error);
      process.exit(1);
    });
}

// ===== EXPORT FOR USE =====

export { setupAndPopulateDatabases };
