import { DataService } from './dataService';
import { MetricsCalculator } from './metricsCalculator';
import { 
  Order, 
  Robot, 
  Cart, 
  Picker, 
  KPI,
  ShiftData 
} from './type';

// ===== API SERVICE CLASS =====

export class APIService {
  private dataService: DataService;
  private isConnected: boolean = false;

  constructor() {
    this.dataService = new DataService();
  }

  // ===== CONNECTION MANAGEMENT =====

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.dataService.connect();
      this.isConnected = true;
      console.log('🔌 API Service connected to databases');
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.dataService.disconnect();
      this.isConnected = false;
      console.log('🔌 API Service disconnected from databases');
    }
  }

  // ===== DASHBOARD API ENDPOINTS =====

  async getDashboardData(): Promise<ShiftData> {
    await this.ensureConnected();
    return await this.dataService.getDashboardData();
  }

  async getDashboardMetrics(): Promise<KPI[]> {
    await this.ensureConnected();
    return await this.dataService.getDashboardMetrics();
  }

  async getRealTimeData(): Promise<{
    activeRobots: number;
    activePickers: number;
    cartsInUse: number;
    completedOrders: number;
    pendingOrders: number;
    pickersOnBreak: number;
  }> {
    await this.ensureConnected();
    return await this.dataService.getRealTimeData();
  }

  // ===== ENTITY DATA ENDPOINTS =====

  async getRobots(): Promise<Robot[]> {
    await this.ensureConnected();
    return await this.dataService.getRobots();
  }

  async getPickers(): Promise<Picker[]> {
    await this.ensureConnected();
    return await this.dataService.getPickers();
  }

  async getCarts(): Promise<Cart[]> {
    await this.ensureConnected();
    return await this.dataService.getCarts();
  }

  async getOrders(): Promise<Order[]> {
    await this.ensureConnected();
    return await this.dataService.getOrders();
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    await this.ensureConnected();
    return await this.dataService.getOrdersByStatus(status);
  }

  // ===== TIME-BASED DATA ENDPOINTS =====

  async getRobotTelemetryOverTime(robotId: string, timeRange: string = '24h'): Promise<any[]> {
    await this.ensureConnected();
    return await this.dataService.getRobotTelemetryOverTime(robotId, timeRange);
  }

  async getPickerActivityOverTime(pickerId: string, timeRange: string = '24h'): Promise<any[]> {
    await this.ensureConnected();
    return await this.dataService.getPickerActivityOverTime(pickerId, timeRange);
  }

  // ===== HELPER FUNCTIONS =====

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  // ===== HEALTH CHECK =====

  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    databases: {
      mongodb: boolean;
      influxdb: boolean;
    };
    data: {
      robots: number;
      pickers: number;
      carts: number;
      orders: number;
    };
  }> {
    try {
      await this.ensureConnected();
      
      const [robots, pickers, carts, orders] = await Promise.all([
        this.getRobots(),
        this.getPickers(),
        this.getCarts(),
        this.getOrders()
      ]);

      return {
        status: 'healthy',
        databases: {
          mongodb: true,
          influxdb: true
        },
        data: {
          robots: robots.length,
          pickers: pickers.length,
          carts: carts.length,
          orders: orders.length
        }
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        databases: {
          mongodb: false,
          influxdb: false
        },
        data: {
          robots: 0,
          pickers: 0,
          carts: 0,
          orders: 0
        }
      };
    }
  }
}

// ===== SINGLETON INSTANCE =====

let apiServiceInstance: APIService | null = null;

export function getAPIService(): APIService {
  if (!apiServiceInstance) {
    apiServiceInstance = new APIService();
  }
  return apiServiceInstance;
}

// ===== EXPORT FOR USE =====

// APIService is already exported above as a class, no need to re-export
