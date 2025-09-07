import { DatabaseConfig } from './type';

// ===== DATABASE CONFIGURATION =====

export const DATABASE_CONFIG: DatabaseConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'Enter your URL here',
    database: 'warehouse_analytics',
    collections: {
      orders: 'orders',
      robots: 'robots',
      carts: 'carts',
      pickers: 'pickers'
    }
  },
  influxdb: {
    url: process.env.INFLUXDB_URL || 'Enter your URL here',
    token: process.env.INFLUXDB_TOKEN || 'Enter your token here',
    org: process.env.INFLUXDB_ORG || 'Enter your Organization',
    bucket: process.env.INFLUXDB_BUCKET || 'amr-analytics-data',
    measurements: {
      robotTelemetry: 'robot_telemetry_v2',
      pickerActivity: 'picker_activity_v2',
      orderEvents: 'order_events_v2',
      cartMovement: 'cart_movement_v2'
    }
  }
};

// ===== INFLUXDB QUERY TEMPLATES =====

export const INFLUXDB_QUERIES = {
  // Get latest robot telemetry
  getLatestRobotTelemetry: `
    from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
    |> range(start: -24h)
    |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.robotTelemetry}")
    |> last()
    |> group(columns: ["robot_id"])
  `,
  
  // Get latest picker activity
  getLatestPickerActivity: `
    from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
    |> range(start: -24h)
    |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.pickerActivity}")
    |> last()
    |> group(columns: ["picker_id"])
  `,
  
  // Get latest order events
  getLatestOrderEvents: `
    from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
    |> range(start: -24h)
    |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.orderEvents}")
    |> last()
    |> group(columns: ["order_id"])
  `,
  
  // Get latest cart movement
  getLatestCartMovement: `
    from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
    |> range(start: -24h)
    |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.cartMovement}")
    |> last()
    |> group(columns: ["cart_id"])
  `,
  
  // Get robot performance over time
  getRobotPerformanceOverTime: (robotId: string, timeRange: string) => `
    from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
    |> range(start: -${timeRange})
    |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.robotTelemetry}")
    |> filter(fn: (r) => r.robot_id == "${robotId}")
    |> group(columns: ["robot_id"])
    |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
  `,
  
  // Get picker efficiency over time
  getPickerEfficiencyOverTime: (pickerId: string, timeRange: string) => `
    from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
    |> range(start: -${timeRange})
    |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.pickerActivity}")
    |> filter(fn: (r) => r.picker_id == "${pickerId}")
    |> group(columns: ["picker_id"])
    |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
  `,
  
  // Get order completion rate over time
  getOrderCompletionRate: (timeRange: string) => `
    from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
    |> range(start: -${timeRange})
    |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.orderEvents}")
    |> filter(fn: (r) => r.event_type == "completed")
    |> group(columns: ["order_id"])
    |> aggregateWindow(every: 1h, fn: count, createEmpty: false)
  `
};

// ===== MONGODB QUERY TEMPLATES =====

export const MONGODB_QUERIES = {
  // Get all robots
  getAllRobots: () => ({
    collection: DATABASE_CONFIG.mongodb.collections.robots,
    query: {},
    options: { sort: { id: 1 } }
  }),
  
  // Get all pickers
  getAllPickers: () => ({
    collection: DATABASE_CONFIG.mongodb.collections.pickers,
    query: {},
    options: { sort: { id: 1 } }
  }),
  
  // Get all carts
  getAllCarts: () => ({
    collection: DATABASE_CONFIG.mongodb.collections.carts,
    query: {},
    options: { sort: { id: 1 } }
  }),
  
  // Get all orders
  getAllOrders: () => ({
    collection: DATABASE_CONFIG.mongodb.collections.orders,
    query: {},
    options: { sort: { createdAt: -1 } }
  }),
  
  // Get orders by status
  getOrdersByStatus: (status: string) => ({
    collection: DATABASE_CONFIG.mongodb.collections.orders,
    query: { status },
    options: { sort: { createdAt: -1 } }
  }),
  
  // Get orders by priority
  getOrdersByPriority: (priority: string) => ({
    collection: DATABASE_CONFIG.mongodb.collections.orders,
    query: { priority },
    options: { sort: { createdAt: -1 } }
  })
};
