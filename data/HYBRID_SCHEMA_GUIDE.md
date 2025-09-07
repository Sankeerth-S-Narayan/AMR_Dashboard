# Hybrid Database Schema Guide

## 🗄️ **Database Architecture**

### **MongoDB (Entity Data)**
- **Purpose**: Static entity information and configuration
- **Collections**: `orders`, `robots`, `carts`, `pickers`
- **Data**: Entity metadata, relationships, configuration

### **InfluxDB (Time-Series Data)**
- **Purpose**: Time-stamped operational data and metrics
- **Measurements**: `robot_telemetry`, `picker_activity`, `order_events`, `cart_movement`
- **Data**: Real-time telemetry, performance metrics, status changes

---

## ⏰ **Timestamp Strategy**

### **MongoDB Timestamps**
```typescript
// Entity creation and modification tracking
{
  createdAt: Date;    // When entity was created
  updatedAt: Date;    // Last modification
}
```

### **InfluxDB Timestamps**
```typescript
// Every data point has a timestamp
{
  time: Date;         // Primary key - when event occurred
  // ... other fields
}
```

---

## 📊 **Dashboard Metrics Coverage**

### **All 16 Dashboard Metrics Supported:**

#### **Quick Stats (6 metrics)**
1. **Active Robots** ✅ - `robot_telemetry` with `status = 'active'`
2. **Active Pickers** ✅ - `picker_activity` with `status = 'active'`
3. **Carts in Use** ✅ - `cart_movement` with `status = 'picking'`
4. **Completed Orders** ✅ - `order_events` with `event_type = 'completed'`
5. **Pending Orders** ✅ - `order_events` with `status = 'pending'`
6. **On Break** ✅ - `picker_activity` with `status = 'break'`

#### **KPI Overview (10 metrics)**
1. **Orders Completed** ✅ - Count of completed order events
2. **Total Picks** ✅ - Sum of `total_picks` from picker activity
3. **Pick Accuracy** ✅ - Average of `accuracy` from picker activity
4. **Picks Per Hour** ✅ - Average of `picks_per_hour` from picker activity
5. **Robot Utilization** ✅ - Percentage of active robots
6. **Picker Utilization** ✅ - Percentage of active pickers
7. **Order Fulfillment Rate** ✅ - Completed vs total orders
8. **Average Battery Level** ✅ - Average of `battery` from robot telemetry
9. **Active Robots** ✅ - Count of active robots
10. **Carts in Use** ✅ - Count of carts in picking status

---

## 🔄 **Data Flow**

### **1. Entity Management (MongoDB)**
```
Create Robot → MongoDB.robots
Create Picker → MongoDB.pickers
Create Cart → MongoDB.carts
Create Order → MongoDB.orders
```

### **2. Real-time Operations (InfluxDB)**
```
Robot Status Change → InfluxDB.robot_telemetry
Picker Activity → InfluxDB.picker_activity
Order Status Change → InfluxDB.order_events
Cart Movement → InfluxDB.cart_movement
```

### **3. Dashboard Data (Combined)**
```
MongoDB Entities + InfluxDB Latest Data → Dashboard Metrics
```

---

## 📈 **Time-Based Analytics**

### **Real-time Queries**
```typescript
// Get latest robot status
const latestRobots = await influxDB.query(`
  from(bucket: "warehouse-telemetry")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "robot_telemetry")
  |> last()
  |> group(columns: ["robot_id"])
`);
```

### **Historical Analysis**
```typescript
// Get robot performance over time
const robotPerformance = await influxDB.query(`
  from(bucket: "warehouse-telemetry")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "robot_telemetry")
  |> filter(fn: (r) => r.robot_id == "AMR-001")
  |> aggregateWindow(every: 5m, fn: mean)
`);
```

---

## 🚀 **Scalability Benefits**

### **MongoDB Scaling**
- **Horizontal**: Sharding by entity type
- **Vertical**: Indexes on frequently queried fields
- **Read Replicas**: For analytics queries

### **InfluxDB Scaling**
- **Time-based Partitioning**: Automatic data partitioning
- **Data Compression**: Efficient storage for time-series
- **Retention Policies**: Automatic data lifecycle management

---

## 🔧 **Implementation Example**

### **Data Ingestion**
```typescript
// Robot telemetry update
await influxDB.writePoint({
  measurement: 'robot_telemetry',
  tags: { 
    robot_id: 'AMR-001', 
    status: 'active', 
    location: 'A1-R1-A' 
  },
  fields: { 
    battery: 85, 
    tasks_completed: 25, 
    total_distance: 3500 
  },
  timestamp: new Date()
});
```

### **Metrics Calculation**
```typescript
// Calculate dashboard metrics
const metrics = MetricsCalculator.calculateKPIs(
  robotTelemetry,
  pickerActivity,
  orderEvents,
  cartMovement
);
```

---

## ✅ **Schema Validation**

### **All Dashboard Metrics Covered**
- ✅ **Entity Data**: Complete in MongoDB schemas
- ✅ **Time-Series Data**: Complete in InfluxDB schemas
- ✅ **Metrics Calculation**: Implemented in MetricsCalculator
- ✅ **Database Queries**: Predefined in databaseConfig
- ✅ **Timestamp Support**: Every data point has proper timestamps

### **Future Extensibility**
- ✅ **New Metrics**: Easy to add new InfluxDB measurements
- ✅ **New Entities**: Easy to add new MongoDB collections
- ✅ **Analytics**: Built-in time-series functions
- ✅ **Predictive**: Can add ML models to time-series data

---

## 🎯 **Next Steps**

1. **Setup Databases**: Install MongoDB and InfluxDB
2. **Data Ingestion**: Implement real-time data collection
3. **Dashboard Integration**: Connect to existing frontend
4. **Analytics**: Add trend analysis and predictive models
5. **Scaling**: Implement horizontal scaling strategies
