#!/usr/bin/env node

import { DataService } from './dataService';
import { DATABASE_CONFIG } from './databaseConfig';

// ===== DATA VIEWER SCRIPT =====

class DataViewer {
  private dataService: DataService;

  constructor() {
    this.dataService = new DataService();
  }

  async viewAllData() {
    try {
      console.log('🔍 Connecting to databases...');
      await this.dataService.connect();
      
      console.log('\n📊 === MONGODB DATA ===');
      await this.viewMongoDBData();
      
      console.log('\n⏰ === INFLUXDB DATA ===');
      await this.viewInfluxDBData();
      
      console.log('\n⚡ === REAL-TIME METRICS ===');
      await this.viewRealTimeMetrics();
      
    } catch (error) {
      console.error('❌ Error viewing data:', error);
    } finally {
      await this.dataService.disconnect();
    }
  }

  async viewMongoDBData() {
    // View Robots
    const robots = await this.dataService.getRobots();
    console.log(`\n🤖 Robots (${robots.length}):`);
    robots.slice(0, 3).forEach(robot => {
      console.log(`  ${robot.id}: ${robot.name} - Max Battery: ${robot.maxBattery}% - Max Capacity: ${robot.maxCapacity}`);
    });
    if (robots.length > 3) console.log(`  ... and ${robots.length - 3} more`);

    // View Pickers
    const pickers = await this.dataService.getPickers();
    console.log(`\n👷 Pickers (${pickers.length}):`);
    pickers.slice(0, 3).forEach(picker => {
      console.log(`  ${picker.id}: ${picker.name} - Shift: ${picker.shiftSchedule} - Max Carts: ${picker.maxCartsPerPicker}`);
    });
    if (pickers.length > 3) console.log(`  ... and ${pickers.length - 3} more`);

    // View Carts
    const carts = await this.dataService.getCarts();
    console.log(`\n🛒 Carts (${carts.length}):`);
    carts.slice(0, 3).forEach(cart => {
      console.log(`  ${cart.id}: ${cart.status} - Max Capacity: ${cart.maxCapacity}`);
    });
    if (carts.length > 3) console.log(`  ... and ${carts.length - 3} more`);

    // View Orders
    const orders = await this.dataService.getOrders();
    console.log(`\n📦 Orders (${orders.length}):`);
    orders.slice(0, 3).forEach(order => {
      console.log(`  ${order.id}: ${order.status} - ${order.items.length} items - Priority: ${order.priority}`);
    });
    if (orders.length > 3) console.log(`  ... and ${orders.length - 3} more`);
  }

  async viewInfluxDBData() {
    // View Robot Telemetry
    const robotTelemetry = await this.dataService.getLatestRobotTelemetry();
    console.log(`\n📡 Robot Telemetry (${robotTelemetry.length} latest):`);
    robotTelemetry.slice(0, 3).forEach(telemetry => {
      console.log(`  ${telemetry.robot_id}: ${telemetry.status} - Battery: ${telemetry.battery}% - Location: ${telemetry.location}`);
    });
    if (robotTelemetry.length > 3) console.log(`  ... and ${robotTelemetry.length - 3} more`);

    // View Picker Activity
    const pickerActivity = await this.dataService.getLatestPickerActivity();
    console.log(`\n👷 Picker Activity (${pickerActivity.length} latest):`);
    pickerActivity.slice(0, 3).forEach(activity => {
      console.log(`  ${activity.picker_id}: ${activity.status} - Picks/hr: ${activity.picks_per_hour} - Accuracy: ${activity.accuracy}%`);
    });
    if (pickerActivity.length > 3) console.log(`  ... and ${pickerActivity.length - 3} more`);

    // View Order Events
    const orderEvents = await this.dataService.getLatestOrderEvents();
    console.log(`\n📦 Order Events (${orderEvents.length} latest):`);
    orderEvents.slice(0, 3).forEach(event => {
      console.log(`  ${event.order_id}: ${event.event_type} - ${event.status} - ${event.time}`);
    });
    if (orderEvents.length > 3) console.log(`  ... and ${orderEvents.length - 3} more`);

    // View Cart Movement
    const cartMovement = await this.dataService.getLatestCartMovement();
    console.log(`\n🛒 Cart Movement (${cartMovement.length} latest):`);
    cartMovement.slice(0, 3).forEach(movement => {
      console.log(`  ${movement.cart_id}: ${movement.status} - ${movement.location} - ${movement.time}`);
    });
    if (cartMovement.length > 3) console.log(`  ... and ${cartMovement.length - 3} more`);
  }

  async viewRealTimeMetrics() {
    const realTimeData = await this.dataService.getRealTimeData();
    
    console.log(`Active Robots: ${realTimeData.activeRobots}/8`);
    console.log(`Active Pickers: ${realTimeData.activePickers}/8`);
    console.log(`Carts in Use: ${realTimeData.cartsInUse}/20`);
    console.log(`Completed Orders: ${realTimeData.completedOrders}`);
    console.log(`Pending Orders: ${realTimeData.pendingOrders}`);
    console.log(`Pickers on Break: ${realTimeData.pickersOnBreak}`);
  }
}

// ===== RUN THE VIEWER =====

async function main() {
  const viewer = new DataViewer();
  await viewer.viewAllData();
}

if (require.main === module) {
  main().catch(console.error);
}

export { DataViewer };
