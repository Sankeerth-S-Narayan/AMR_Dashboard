import { DatabaseManager } from './databaseSetup';
import { MetricsCalculator } from './metricsCalculator';
import { 
  Order, 
  Robot, 
  Cart, 
  Picker, 
  RobotTelemetry, 
  PickerActivity, 
  OrderEvents, 
  CartMovement,
  KPI,
  ShiftData 
} from './type';
import { DATABASE_CONFIG } from './databaseConfig';

// ===== DATA SERVICE CLASS =====

export class DataService {
  private dbManager: DatabaseManager;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  constructor() {
    this.dbManager = new DatabaseManager(DATABASE_CONFIG);
  }

  // ===== CONNECTION MANAGEMENT =====

  async connect(): Promise<void> {
    await this.dbManager.connectMongoDB();
    await this.dbManager.connectInfluxDB();
  }

  async disconnect(): Promise<void> {
    await this.dbManager.disconnect();
  }

  // ===== MONGODB DATA RETRIEVAL =====

  async getRobots(): Promise<Robot[]> {
    const collection = this.dbManager.getRobotsCollection();
    return await collection.find({}).sort({ id: 1 }).toArray();
  }

  async getPickers(): Promise<Picker[]> {
    const collection = this.dbManager.getPickersCollection();
    return await collection.find({}).sort({ id: 1 }).toArray();
  }

  async getCarts(): Promise<Cart[]> {
    const collection = this.dbManager.getCartsCollection();
    return await collection.find({}).sort({ id: 1 }).toArray();
  }

  async getOrders(): Promise<Order[]> {
    const collection = this.dbManager.getOrdersCollection();
    return await collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    const collection = this.dbManager.getOrdersCollection();
    return await collection.find({ status: status as 'pending' | 'picking' | 'packed' }).sort({ createdAt: -1 }).toArray();
  }

  // ===== INFLUXDB DATA RETRIEVAL =====

  async getLatestRobotTelemetry(): Promise<RobotTelemetry[]> {
    if (!this.dbManager['influxDB']) throw new Error('InfluxDB not connected');
    
    const query = `
      from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.robotTelemetry}")
      |> group(columns: ["robot_id"])
      |> last()
      |> limit(n: 8)
    `;
    
    const queryApi = this.dbManager['influxDB'].getQueryApi(DATABASE_CONFIG.influxdb.org);
    const result = await queryApi.collectRows(query);
    return this.parseInfluxDBResult(result, 'robot_telemetry') as RobotTelemetry[];
  }

  async getLatestPickerActivity(): Promise<PickerActivity[]> {
    if (!this.dbManager['influxDB']) throw new Error('InfluxDB not connected');
    
    const query = `
      from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.pickerActivity}")
      |> group(columns: ["picker_id"])
      |> last()
      |> limit(n: 8)
    `;
    
    const queryApi = this.dbManager['influxDB'].getQueryApi(DATABASE_CONFIG.influxdb.org);
    const result = await queryApi.collectRows(query);
    return this.parseInfluxDBResult(result, 'picker_activity') as PickerActivity[];
  }

  async getLatestOrderEvents(): Promise<OrderEvents[]> {
    if (!this.dbManager['influxDB']) throw new Error('InfluxDB not connected');
    
    const query = `
      from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.orderEvents}")
      |> group(columns: ["order_id"])
      |> last()
      |> limit(n: 50)
    `;
    
    const queryApi = this.dbManager['influxDB'].getQueryApi(DATABASE_CONFIG.influxdb.org);
    const result = await queryApi.collectRows(query);
    return this.parseInfluxDBResult(result, 'order_events') as OrderEvents[];
  }

  async getLatestCartMovement(): Promise<CartMovement[]> {
    if (!this.dbManager['influxDB']) throw new Error('InfluxDB not connected');
    
    const query = `
      from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.cartMovement}")
      |> group(columns: ["cart_id"])
      |> last()
      |> limit(n: 20)
    `;
    
    const queryApi = this.dbManager['influxDB'].getQueryApi(DATABASE_CONFIG.influxdb.org);
    const result = await queryApi.collectRows(query);
    return this.parseInfluxDBResult(result, 'cart_movement') as CartMovement[];
  }

  // ===== TIME-BASED QUERIES =====

  async getRobotTelemetryOverTime(robotId: string, timeRange: string = '24h'): Promise<RobotTelemetry[]> {
    if (!this.dbManager['influxDB']) throw new Error('InfluxDB not connected');
    
    const query = `
      from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
      |> range(start: -${timeRange})
      |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.robotTelemetry}")
      |> filter(fn: (r) => r.robot_id == "${robotId}")
      |> group(columns: ["robot_id"])
      |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
    `;
    
    const queryApi = this.dbManager['influxDB'].getQueryApi(DATABASE_CONFIG.influxdb.org);
    const result = await queryApi.collectRows(query);
    return this.parseInfluxDBResult(result, 'robot_telemetry') as RobotTelemetry[];
  }

  async getPickerActivityOverTime(pickerId: string, timeRange: string = '24h'): Promise<PickerActivity[]> {
    if (!this.dbManager['influxDB']) throw new Error('InfluxDB not connected');
    
    const query = `
      from(bucket: "${DATABASE_CONFIG.influxdb.bucket}")
      |> range(start: -${timeRange})
      |> filter(fn: (r) => r._measurement == "${DATABASE_CONFIG.influxdb.measurements.pickerActivity}")
      |> filter(fn: (r) => r.picker_id == "${pickerId}")
      |> group(columns: ["picker_id"])
      |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
    `;
    
    const queryApi = this.dbManager['influxDB'].getQueryApi(DATABASE_CONFIG.influxdb.org);
    const result = await queryApi.collectRows(query);
    return this.parseInfluxDBResult(result, 'picker_activity') as PickerActivity[];
  }

  // ===== DASHBOARD DATA =====

  async getDashboardData(): Promise<ShiftData> {
    // Check cache first
    const cachedData = this.getCachedData('dashboard');
    if (cachedData) {
      console.log('📊 Using cached dashboard data');
      return cachedData;
    }

    console.log('📊 Fetching dashboard data from databases...');
    
    try {
      // Get MongoDB entities
      const [robots, pickers, carts, orders] = await Promise.all([
        this.getRobots(),
        this.getPickers(),
        this.getCarts(),
        this.getOrders()
      ]);
      
      // Get InfluxDB time-series data
      const [robotTelemetry, pickerActivity, orderEvents, cartMovement] = await Promise.all([
        this.getLatestRobotTelemetry(),
        this.getLatestPickerActivity(),
        this.getLatestOrderEvents(),
        this.getLatestCartMovement()
      ]);
      
      const shiftData: ShiftData = {
        // MongoDB entities
        robots,
        pickers,
        carts,
        orders,
        
        // InfluxDB time-series
        robotTelemetry,
        pickerActivity,
        orderEvents,
        cartMovement,
        
        // Shift metadata
        shiftStart: new Date('2025-09-07T08:00:00'),
        shiftEnd: new Date('2025-09-07T14:00:00'),
        currentTime: new Date()
      };

      // Cache the result
      this.setCachedData('dashboard', shiftData);
      console.log('📊 Dashboard data cached successfully');
      
      return shiftData;
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      throw error;
    }
  }

  async getDashboardMetrics(): Promise<KPI[]> {
    const shiftData = await this.getDashboardData();
    
    return MetricsCalculator.calculateKPIs(
      shiftData.robotTelemetry,
      shiftData.pickerActivity,
      shiftData.orderEvents,
      shiftData.cartMovement
    );
  }

  // ===== HELPER FUNCTIONS =====

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private parseInfluxDBResult(result: any[], measurementType: string): any[] {
    // Parse the modern InfluxDB client result format
    console.log(`📊 Parsing InfluxDB result for ${measurementType}: ${result.length} rows`);
    
    if (!result || result.length === 0) {
      return [];
    }

    // Convert InfluxDB rows to our data format
    return result.map(row => {
      const data: any = {};
      
      // Extract tags and fields from the row
      if (row._field && row._value !== undefined) {
        data[row._field] = row._value;
      }
      
      // Add common fields
      data.time = row._time;
      data[`${measurementType.split('_')[0]}_id`] = row.robot_id || row.picker_id || row.cart_id || row.order_id;
      
      // Add other tags
      Object.keys(row).forEach(key => {
        if (key.startsWith('_') || key === 'result' || key === 'table') return;
        data[key] = row[key];
      });
      
      return data;
    });
  }

  // ===== REAL-TIME DATA =====

  async getRealTimeData(): Promise<{
    activeRobots: number;
    activePickers: number;
    cartsInUse: number;
    completedOrders: number;
    pendingOrders: number;
    pickersOnBreak: number;
  }> {
    const shiftData = await this.getDashboardData();
    
    return {
      activeRobots: MetricsCalculator.calculateActiveRobots(shiftData.robotTelemetry),
      activePickers: MetricsCalculator.calculateActivePickers(shiftData.pickerActivity),
      cartsInUse: MetricsCalculator.calculateCartsInUse(shiftData.cartMovement),
      completedOrders: MetricsCalculator.calculateCompletedOrders(shiftData.orderEvents),
      pendingOrders: MetricsCalculator.calculatePendingOrders(shiftData.orderEvents),
      pickersOnBreak: MetricsCalculator.calculatePickersOnBreak(shiftData.pickerActivity)
    };
  }
}

// ===== EXPORT FOR USE =====

// DataService is already exported above as a class, no need to re-export
