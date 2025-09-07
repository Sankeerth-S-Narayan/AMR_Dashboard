import { MongoClient, Db, Collection } from 'mongodb';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { 
  Order, 
  Robot, 
  Cart, 
  Picker, 
  RobotTelemetry, 
  PickerActivity, 
  OrderEvents, 
  CartMovement,
  DatabaseConfig 
} from './type';
import { DATABASE_CONFIG } from './databaseConfig';
import { ShiftDataGenerator } from './shiftDataGenerator';

// ===== DATABASE CONNECTION CLASS =====

export class DatabaseManager {
  private mongoClient: MongoClient | null = null;
  private mongoDb: Db | null = null;
  private influxDB: InfluxDB | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig = DATABASE_CONFIG) {
    this.config = config;
  }

  // ===== MONGODB CONNECTION =====

  async connectMongoDB(): Promise<void> {
    try {
      console.log('🔌 Connecting to MongoDB...');
      this.mongoClient = new MongoClient(this.config.mongodb.uri);
      await this.mongoClient.connect();
      this.mongoDb = this.mongoClient.db(this.config.mongodb.database);
      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnectMongoDB(): Promise<void> {
    if (this.mongoClient) {
      await this.mongoClient.close();
      console.log('🔌 MongoDB disconnected');
    }
  }

  // ===== INFLUXDB CONNECTION =====

  async connectInfluxDB(): Promise<void> {
    try {
      console.log('🔌 Connecting to InfluxDB...');
      this.influxDB = new InfluxDB({
        url: `https://${this.config.influxdb.url}`,
        token: this.config.influxdb.token
      });
      
      // Test connection by trying to get query API
      this.influxDB.getQueryApi(this.config.influxdb.org);
      console.log('✅ InfluxDB connected successfully');
    } catch (error) {
      console.error('❌ InfluxDB connection failed:', error);
      throw error;
    }
  }

  // ===== MONGODB COLLECTIONS =====

  getOrdersCollection(): Collection<Order> {
    if (!this.mongoDb) throw new Error('MongoDB not connected');
    return this.mongoDb.collection<Order>(this.config.mongodb.collections.orders);
  }

  getRobotsCollection(): Collection<Robot> {
    if (!this.mongoDb) throw new Error('MongoDB not connected');
    return this.mongoDb.collection<Robot>(this.config.mongodb.collections.robots);
  }

  getCartsCollection(): Collection<Cart> {
    if (!this.mongoDb) throw new Error('MongoDB not connected');
    return this.mongoDb.collection<Cart>(this.config.mongodb.collections.carts);
  }

  getPickersCollection(): Collection<Picker> {
    if (!this.mongoDb) throw new Error('MongoDB not connected');
    return this.mongoDb.collection<Picker>(this.config.mongodb.collections.pickers);
  }

  // ===== MONGODB DATA OPERATIONS =====

  async insertOrders(orders: Order[]): Promise<void> {
    const collection = this.getOrdersCollection();
    await collection.insertMany(orders);
    console.log(`📦 Inserted ${orders.length} orders into MongoDB`);
  }

  async insertRobots(robots: Robot[]): Promise<void> {
    const collection = this.getRobotsCollection();
    await collection.insertMany(robots);
    console.log(`🤖 Inserted ${robots.length} robots into MongoDB`);
  }

  async insertCarts(carts: Cart[]): Promise<void> {
    const collection = this.getCartsCollection();
    await collection.insertMany(carts);
    console.log(`🛒 Inserted ${carts.length} carts into MongoDB`);
  }

  async insertPickers(pickers: Picker[]): Promise<void> {
    const collection = this.getPickersCollection();
    await collection.insertMany(pickers);
    console.log(`👥 Inserted ${pickers.length} pickers into MongoDB`);
  }

  // ===== INFLUXDB DATA OPERATIONS =====

  async insertRobotTelemetry(telemetry: RobotTelemetry[]): Promise<void> {
    if (!this.influxDB) throw new Error('InfluxDB not connected');
    
    const writeApi = this.influxDB.getWriteApi(this.config.influxdb.org, this.config.influxdb.bucket);
    
    const points = telemetry.map(rt => {
      const point = new Point(this.config.influxdb.measurements.robotTelemetry)
        .tag('robot_id', rt.robot_id)
        .tag('status', rt.status)
        .tag('location', rt.location)
        .tag('assigned_cart', rt.assigned_cart || '')
        .floatField('battery', rt.battery)
        .floatField('tasks_completed', rt.tasks_completed)
        .floatField('total_distance', rt.total_distance)
        .timestamp(rt.time);
      return point;
    });

    writeApi.writePoints(points);
    await writeApi.close();
    console.log(`📊 Inserted ${telemetry.length} robot telemetry points into InfluxDB`);
  }

  async insertPickerActivity(activity: PickerActivity[]): Promise<void> {
    if (!this.influxDB) throw new Error('InfluxDB not connected');
    
    const writeApi = this.influxDB.getWriteApi(this.config.influxdb.org, this.config.influxdb.bucket);
    
    const points = activity.map(pa => {
      const point = new Point(this.config.influxdb.measurements.pickerActivity)
        .tag('picker_id', pa.picker_id)
        .tag('status', pa.status)
        .tag('location', pa.location)
        .tag('assigned_carts', pa.assigned_carts)
        .floatField('picks_per_hour', pa.picks_per_hour)
        .floatField('total_picks', pa.total_picks)
        .floatField('accuracy', pa.accuracy)
        .floatField('break_duration', pa.break_duration || 0)
        .timestamp(pa.time);
      return point;
    });

    writeApi.writePoints(points);
    await writeApi.close();
    console.log(`📊 Inserted ${activity.length} picker activity points into InfluxDB`);
  }

  async insertOrderEvents(events: OrderEvents[]): Promise<void> {
    if (!this.influxDB) throw new Error('InfluxDB not connected');
    
    const writeApi = this.influxDB.getWriteApi(this.config.influxdb.org, this.config.influxdb.bucket);
    
    const points = events.map(oe => {
      const point = new Point(this.config.influxdb.measurements.orderEvents)
        .tag('order_id', oe.order_id)
        .tag('priority', oe.priority)
        .tag('status', oe.status)
        .tag('assigned_picker', oe.assigned_picker || '')
        .tag('event_type', oe.event_type)
        .floatField('item_count', oe.item_count)
        .floatField('estimated_time', oe.estimated_time)
        .floatField('actual_time', oe.actual_time || 0)
        .timestamp(oe.time);
      return point;
    });

    writeApi.writePoints(points);
    await writeApi.close();
    console.log(`📊 Inserted ${events.length} order events into InfluxDB`);
  }

  async insertCartMovement(movement: CartMovement[]): Promise<void> {
    if (!this.influxDB) throw new Error('InfluxDB not connected');
    
    const writeApi = this.influxDB.getWriteApi(this.config.influxdb.org, this.config.influxdb.bucket);
    
    const points = movement.map(cm => {
      const point = new Point(this.config.influxdb.measurements.cartMovement)
        .tag('cart_id', cm.cart_id)
        .tag('status', cm.status)
        .tag('location', cm.location)
        .tag('assigned_picker', cm.assigned_picker || '')
        .tag('assigned_robot', cm.assigned_robot || '')
        .floatField('items_in_cart', cm.items_in_cart)
        .floatField('capacity_utilization', cm.capacity_utilization)
        .timestamp(cm.time);
      return point;
    });

    writeApi.writePoints(points);
    await writeApi.close();
    console.log(`📊 Inserted ${movement.length} cart movement points into InfluxDB`);
  }

  // ===== DATABASE SETUP =====

  async setupDatabases(): Promise<void> {
    console.log('🚀 Setting up databases...');
    
    // Connect to both databases
    await this.connectMongoDB();
    await this.connectInfluxDB();
    
    // Create indexes for MongoDB collections
    await this.createMongoDBIndexes();
    
    console.log('✅ Database setup completed');
  }

  private async createMongoDBIndexes(): Promise<void> {
    if (!this.mongoDb) throw new Error('MongoDB not connected');
    
    console.log('📋 Creating MongoDB indexes...');
    
    // Orders collection indexes
    await this.mongoDb.collection('orders').createIndex({ id: 1 }, { unique: true });
    await this.mongoDb.collection('orders').createIndex({ status: 1 });
    await this.mongoDb.collection('orders').createIndex({ priority: 1 });
    await this.mongoDb.collection('orders').createIndex({ createdAt: 1 });
    
    // Robots collection indexes
    await this.mongoDb.collection('robots').createIndex({ id: 1 }, { unique: true });
    
    // Carts collection indexes
    await this.mongoDb.collection('carts').createIndex({ id: 1 }, { unique: true });
    
    // Pickers collection indexes
    await this.mongoDb.collection('pickers').createIndex({ id: 1 }, { unique: true });
    
    console.log('✅ MongoDB indexes created');
  }

  // ===== DATA POPULATION =====

  async populateDatabases(): Promise<void> {
    console.log('📊 Populating databases with synthetic data...');
    
    // Generate shift data
    const shiftData = ShiftDataGenerator.generateShiftData();
    
    // Insert MongoDB entities
    await this.insertRobots(shiftData.robots);
    await this.insertPickers(shiftData.pickers);
    await this.insertCarts(shiftData.carts);
    await this.insertOrders(shiftData.orders);
    
    // Insert InfluxDB time-series data
    await this.insertRobotTelemetry(shiftData.robotTelemetry);
    await this.insertPickerActivity(shiftData.pickerActivity);
    await this.insertOrderEvents(shiftData.orderEvents);
    await this.insertCartMovement(shiftData.cartMovement);
    
    console.log('✅ Database population completed');
  }

  // ===== CLEANUP =====

  async cleanupDatabases(): Promise<void> {
    console.log('🧹 Cleaning up databases...');
    
    if (this.mongoDb) {
      // Clear MongoDB collections
      await this.mongoDb.collection('orders').deleteMany({});
      await this.mongoDb.collection('robots').deleteMany({});
      await this.mongoDb.collection('carts').deleteMany({});
      await this.mongoDb.collection('pickers').deleteMany({});
      console.log('✅ MongoDB collections cleared');
    }
    
    if (this.influxDB) {
      // Clear InfluxDB measurements using DELETE query
      const queryApi = this.influxDB.getQueryApi(this.config.influxdb.org);
      const measurements = Object.values(this.config.influxdb.measurements);
      for (const measurement of measurements) {
        try {
          await queryApi.queryRaw(`from(bucket: "${this.config.influxdb.bucket}") |> range(start: 1970-01-01T00:00:00Z) |> filter(fn: (r) => r._measurement == "${measurement}") |> drop()`);
        } catch (error) {
          console.log(`⚠️ Could not clear measurement ${measurement}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      console.log('✅ InfluxDB measurements cleared');
    }
  }

  // ===== DISCONNECT =====

  async disconnect(): Promise<void> {
    await this.disconnectMongoDB();
    console.log('🔌 All database connections closed');
  }
}

// ===== EXPORT FOR USE =====

// DatabaseManager is already exported above as a class, no need to re-export
