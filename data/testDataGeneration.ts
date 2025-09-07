import { ShiftDataGenerator } from './shiftDataGenerator';
import { MetricsCalculator } from './metricsCalculator';

// ===== TEST DATA GENERATION =====

export function testShiftDataGeneration() {
  console.log('🚀 Starting shift data generation test...');
  console.log('📅 Shift: 8:00 AM - 2:00 PM (6 hours)');
  console.log('🤖 Robots: 8 (battery breaks only)');
  console.log('👥 Pickers: 8 (1 hour break: 11:30 AM - 12:30 PM)');
  console.log('🛒 Carts: 20');
  console.log('📦 Orders: 200');
  console.log('');

  // Generate shift data
  const shiftData = ShiftDataGenerator.generateShiftData();
  
  // Calculate metrics
  const metrics = MetricsCalculator.calculateKPIs(
    shiftData.robotTelemetry,
    shiftData.pickerActivity,
    shiftData.orderEvents,
    shiftData.cartMovement
  );
  
  // Display results
  console.log('📊 DASHBOARD METRICS:');
  console.log('====================');
  
  // Quick Stats
  console.log('\n🔍 QUICK STATS:');
  console.log(`Active Robots: ${MetricsCalculator.calculateActiveRobots(shiftData.robotTelemetry)}/8`);
  console.log(`Active Pickers: ${MetricsCalculator.calculateActivePickers(shiftData.pickerActivity)}/8`);
  console.log(`Carts in Use: ${MetricsCalculator.calculateCartsInUse(shiftData.cartMovement)}/20`);
  console.log(`Completed Orders: ${MetricsCalculator.calculateCompletedOrders(shiftData.orderEvents)}`);
  console.log(`Pending Orders: ${MetricsCalculator.calculatePendingOrders(shiftData.orderEvents)}`);
  console.log(`On Break: ${MetricsCalculator.calculatePickersOnBreak(shiftData.pickerActivity)}`);
  
  // KPI Overview
  console.log('\n📈 KPI OVERVIEW:');
  metrics.forEach(metric => {
    console.log(`${metric.name}: ${metric.value} ${metric.unit} (${metric.trend})`);
  });
  
  // Time-based analysis
  console.log('\n⏰ TIME-BASED ANALYSIS:');
  
  // Robot battery levels over time
  const robotBatteryData = shiftData.robotTelemetry
    .filter(rt => rt.robot_id === 'AMR-001')
    .slice(0, 5); // First 5 data points
  
  console.log('\n🔋 Robot AMR-001 Battery Levels:');
  robotBatteryData.forEach(rt => {
    console.log(`${rt.time.toLocaleTimeString()}: ${rt.battery}% (${rt.status})`);
  });
  
  // Picker activity during break
  const breakTimeActivity = shiftData.pickerActivity
    .filter(pa => pa.picker_id === 'PICKER-01' && pa.time >= new Date('2024-01-15T11:30:00') && pa.time <= new Date('2024-01-15T12:30:00'))
    .slice(0, 3); // First 3 data points during break
  
  console.log('\n☕ Picker PICKER-01 During Break (11:30 AM - 12:30 PM):');
  breakTimeActivity.forEach(pa => {
    console.log(`${pa.time.toLocaleTimeString()}: ${pa.status} (${pa.picks_per_hour} picks/hr)`);
  });
  
  // Order processing timeline
  const orderProcessing = shiftData.orderEvents
    .filter(oe => oe.order_id === 'ORD-0001')
    .sort((a, b) => a.time.getTime() - b.time.getTime());
  
  console.log('\n📦 Order ORD-0001 Processing Timeline:');
  orderProcessing.forEach(oe => {
    console.log(`${oe.time.toLocaleTimeString()}: ${oe.event_type} (${oe.status})`);
  });
  
  // Cart utilization
  const cartUtilization = shiftData.cartMovement
    .filter(cm => cm.cart_id === 'CART-001')
    .slice(0, 5); // First 5 data points
  
  console.log('\n🛒 Cart CART-001 Utilization:');
  cartUtilization.forEach(cm => {
    console.log(`${cm.time.toLocaleTimeString()}: ${cm.status} (${cm.items_in_cart} items, ${cm.capacity_utilization}% capacity)`);
  });
  
  console.log('\n✅ Data generation test completed successfully!');
  
  return shiftData;
}

// ===== EXPORT FOR TESTING =====

export { ShiftDataGenerator, MetricsCalculator };
