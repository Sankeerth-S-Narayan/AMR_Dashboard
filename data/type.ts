// ===== MONGODB SCHEMAS (Entity Data) =====

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  location: string; // A1-R1-A, A1-R1-B, etc.
}

export interface Order {
  id: string;                    // ORD-0001, ORD-0002, etc.
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'picking' | 'packed';
  items: OrderItem[];
  estimatedTime: number;         // minutes
  assignedPicker?: string;       // PICKER-01, PICKER-02, etc.
  createdAt: Date;               // When order was created
  updatedAt: Date;               // Last modification
}

export interface Robot {
  id: string;                    // AMR-001, AMR-002, etc.
  name: string;                  // Robot 1, Robot 2, etc.
  maxBattery: number;            // Maximum battery capacity
  maxCapacity: number;           // Maximum cart capacity
  maintenanceSchedule: string;   // Weekly, monthly, etc.
  createdAt: Date;               // When robot was added
  updatedAt: Date;               // Last modification
}

export interface Cart {
  id: string;                    // CART-001, CART-002, etc.
  maxCapacity: number;           // 50 items
  status: 'active' | 'maintenance' | 'retired';
  createdAt: Date;               // When cart was added
  updatedAt: Date;               // Last modification
}

export interface Picker {
  id: string;                    // PICKER-01, PICKER-02, etc.
  name: string;                  // Picker A, Picker B, etc.
  shiftSchedule: string;         // Morning, afternoon, night
  maxCartsPerPicker: number;     // Maximum carts per picker
  createdAt: Date;               // When picker was added
  updatedAt: Date;               // Last modification
}

// ===== INFLUXDB SCHEMAS (Time-Series Data) =====

export interface RobotTelemetry {
  time: Date;                    // Timestamp (InfluxDB primary key)
  robot_id: string;              // Tag: AMR-001, AMR-002, etc.
  status: 'active' | 'charging' | 'maintenance' | 'idle'; // Tag
  location: string;              // Tag: A1-R1-A, A1-R1-B, etc.
  battery: number;               // Field: 0-100%
  tasks_completed: number;       // Field: cumulative tasks
  total_distance: number;        // Field: meters
  assigned_cart?: string;        // Tag: CART-001, CART-002, etc.
}

export interface PickerActivity {
  time: Date;                    // Timestamp (InfluxDB primary key)
  picker_id: string;             // Tag: PICKER-01, PICKER-02, etc.
  status: 'active' | 'break' | 'idle'; // Tag
  location: string;              // Tag: A1-R1-A, A1-R1-B, etc.
  picks_per_hour: number;        // Field: 80-130 range
  total_picks: number;           // Field: cumulative picks this shift
  accuracy: number;              // Field: 95-100%
  assigned_carts: string;        // Tag: comma-separated cart IDs
  break_duration?: number;       // Field: minutes on break
}

export interface OrderEvents {
  time: Date;                    // Timestamp (InfluxDB primary key)
  order_id: string;              // Tag: ORD-0001, ORD-0002, etc.
  priority: 'high' | 'medium' | 'low'; // Tag
  status: 'pending' | 'picking' | 'packed'; // Tag
  assigned_picker?: string;      // Tag: PICKER-01, PICKER-02, etc.
  item_count: number;            // Field: number of items
  estimated_time: number;        // Field: minutes
  actual_time?: number;          // Field: actual completion time
  event_type: string;            // Tag: created, assigned, started, completed
}

export interface CartMovement {
  time: Date;                    // Timestamp (InfluxDB primary key)
  cart_id: string;               // Tag: CART-001, CART-002, etc.
  status: 'picking' | 'idle' | 'maintenance'; // Tag
  location: string;              // Tag: A1-R1-A, A1-R1-B, etc.
  assigned_picker?: string;      // Tag: PICKER-01, PICKER-02, etc.
  assigned_robot?: string;       // Tag: AMR-001, AMR-002, etc.
  items_in_cart: number;         // Field: current items
  capacity_utilization: number;  // Field: percentage of max capacity
}

// ===== DASHBOARD METRICS INTERFACES =====

export interface KPI {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'productivity' | 'efficiency' | 'quality' | 'utilization';
}

// ===== COMBINED DATA INTERFACES =====

export interface ShiftData {
  // MongoDB entities (static data)
  orders: Order[];
  robots: Robot[];
  carts: Cart[];
  pickers: Picker[];
  
  // InfluxDB time-series data (current state)
  robotTelemetry: RobotTelemetry[];
  pickerActivity: PickerActivity[];
  orderEvents: OrderEvents[];
  cartMovement: CartMovement[];
  
  // Shift metadata
  shiftStart: Date;
  shiftEnd: Date;
  currentTime: Date;
}

// ===== DATABASE CONFIGURATION =====

export interface DatabaseConfig {
  mongodb: {
    uri: string;
    database: string;
    collections: {
      orders: string;
      robots: string;
      carts: string;
      pickers: string;
    };
  };
  influxdb: {
    url: string;
    token: string;
    org: string;
    bucket: string;
    measurements: {
      robotTelemetry: string;
      pickerActivity: string;
      orderEvents: string;
      cartMovement: string;
    };
  };
}
