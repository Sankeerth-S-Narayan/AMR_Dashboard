# Shift Data Generator

## 🚀 **Overview**

This module generates realistic warehouse data for a single shift (8:00 AM - 2:00 PM) with proper break schedules and time-based metrics.

## ⏰ **Shift Configuration**

- **Duration**: 6 hours (8:00 AM - 2:00 PM)
- **Robots**: 8 robots with battery-based breaks only
- **Pickers**: 8 pickers with 1-hour break (11:30 AM - 12:30 PM)
- **Carts**: 20 carts
- **Orders**: 200 orders

## 📊 **Generated Data**

### **MongoDB Entities (Static Data)**
- **Robots**: Basic robot information and configuration
- **Pickers**: Picker profiles and shift schedules
- **Carts**: Cart specifications and capacity
- **Orders**: Order details with items and priorities

### **InfluxDB Time-Series (Dynamic Data)**
- **Robot Telemetry**: Battery levels, status, location every 5 minutes
- **Picker Activity**: Performance metrics, break status every 5 minutes
- **Order Events**: Status changes, processing timeline
- **Cart Movement**: Location, assignments, utilization every 10 minutes

## 🔧 **Usage**

```typescript
import { ShiftDataGenerator } from './shiftDataGenerator';
import { MetricsCalculator } from './metricsCalculator';

// Generate complete shift data
const shiftData = ShiftDataGenerator.generateShiftData();

// Calculate dashboard metrics
const metrics = MetricsCalculator.calculateKPIs(
  shiftData.robotTelemetry,
  shiftData.pickerActivity,
  shiftData.orderEvents,
  shiftData.cartMovement
);

// Get specific metrics
const activeRobots = MetricsCalculator.calculateActiveRobots(shiftData.robotTelemetry);
const activePickers = MetricsCalculator.calculateActivePickers(shiftData.pickerActivity);
const completedOrders = MetricsCalculator.calculateCompletedOrders(shiftData.orderEvents);
```

## 📈 **Realistic Features**

### **Robot Behavior**
- **Battery Management**: Robots charge when battery < 20%
- **Performance Variation**: Different robots have different base performance
- **Maintenance**: 5% chance of maintenance events
- **Distance Tracking**: Realistic distance accumulation over time

### **Picker Behavior**
- **Break Schedule**: All pickers take break from 11:30 AM - 12:30 PM
- **Performance Degradation**: Efficiency decreases over time due to fatigue
- **Accuracy Variation**: Different pickers have different base accuracy
- **Cart Assignments**: 1-2 carts per picker

### **Order Processing**
- **Priority Distribution**: 20% high, 50% medium, 30% low priority
- **Processing Timeline**: Realistic order lifecycle events
- **Completion Rates**: 70% of orders get processed, 60% complete during shift
- **Time Estimation**: Based on item count with realistic variations

### **Cart Utilization**
- **Dynamic Assignment**: Carts assigned to pickers and robots
- **Capacity Tracking**: Realistic item counts and utilization percentages
- **Status Changes**: Carts move between picking, idle, and maintenance

## 🎯 **Dashboard Metrics Support**

All 16 dashboard metrics are supported:

### **Quick Stats**
- Active Robots, Active Pickers, Carts in Use
- Completed Orders, Pending Orders, On Break

### **KPI Overview**
- Orders Completed, Total Picks, Pick Accuracy
- Picks Per Hour, Robot Utilization, Picker Utilization
- Order Fulfillment Rate, Average Battery Level
- Active Robots, Carts in Use

## 🔄 **Time-Based Data**

### **Data Points Generated**
- **Robot Telemetry**: 72 data points per robot (every 5 minutes)
- **Picker Activity**: 72 data points per picker (every 5 minutes)
- **Order Events**: Variable based on order processing
- **Cart Movement**: 36 data points per cart (every 10 minutes)

### **Total Data Points**
- **Robot Telemetry**: 576 data points (8 robots × 72 points)
- **Picker Activity**: 576 data points (8 pickers × 72 points)
- **Order Events**: ~400-600 events (depending on processing)
- **Cart Movement**: 720 data points (20 carts × 36 points)

## 🚀 **Testing**

```typescript
import { testShiftDataGeneration } from './testDataGeneration';

// Run the test
const shiftData = testShiftDataGeneration();
```

This will generate data and display:
- Dashboard metrics
- Time-based analysis
- Robot battery levels
- Picker break behavior
- Order processing timeline
- Cart utilization patterns

## 📝 **Output Example**

```
🚀 Starting shift data generation test...
📅 Shift: 8:00 AM - 2:00 PM (6 hours)
🤖 Robots: 8 (battery breaks only)
👥 Pickers: 8 (1 hour break: 11:30 AM - 12:30 PM)
🛒 Carts: 20
📦 Orders: 200

Generated 8 robots, 8 pickers, 20 carts, 200 orders
Generated 576 robot telemetry points, 576 picker activity points
Generated 450 order events, 720 cart movement points

📊 DASHBOARD METRICS:
====================

🔍 QUICK STATS:
Active Robots: 6/8
Active Pickers: 0/8
Carts in Use: 12/20
Completed Orders: 45
Pending Orders: 155
On Break: 8

📈 KPI OVERVIEW:
Orders Completed: 45 orders (up)
Total Picks: 1,250 picks (up)
Pick Accuracy: 97.8% (stable)
Picks Per Hour: 105 picks/hr (up)
Robot Utilization: 75.0% (stable)
Picker Utilization: 0.0% (up)
Order Fulfillment Rate: 22.5% (up)
Average Battery Level: 65% (stable)
Active Robots: 6 robots (stable)
Carts in Use: 12 carts (up)
```

## ✅ **Ready for Dashboard Integration**

The generated data is fully compatible with the existing dashboard and can be used to:
- Replace synthetic data in the frontend
- Test dashboard functionality
- Validate metrics calculations
- Demonstrate realistic warehouse operations
