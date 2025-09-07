// ===== API SERVICE FOR FRONTEND =====

const API_BASE_URL = 'http://localhost:3001/api';

// ===== TYPES =====

export interface Robot {
  id: string;
  name: string;
  maxBattery: number;
  maxCapacity: number;
  maintenanceSchedule: string;
  createdAt: string;
  updatedAt: string;
}

export interface Picker {
  id: string;
  name: string;
  shiftSchedule: string;
  maxCartsPerPicker: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  maxCapacity: number;
  status: 'active' | 'maintenance' | 'retired';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
}

export interface Order {
  id: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'picking' | 'packed';
  items: OrderItem[];
  estimatedTime: number;
  assignedPicker?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KPI {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'productivity' | 'efficiency' | 'quality' | 'utilization';
}

export interface RealTimeData {
  activeRobots: number;
  activePickers: number;
  cartsInUse: number;
  completedOrders: number;
  pendingOrders: number;
  pickersOnBreak: number;
}

export interface DashboardData {
  robots: Robot[];
  pickers: Picker[];
  carts: Cart[];
  orders: Order[];
  robotTelemetry: any[];
  pickerActivity: any[];
  orderEvents: any[];
  cartMovement: any[];
  shiftStart: string;
  shiftEnd: string;
  currentTime: string;
}

export interface HealthCheck {
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
}

// ===== API SERVICE CLASS =====

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // ===== HELPER METHODS =====

  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ===== HEALTH CHECK =====

  async healthCheck(): Promise<HealthCheck> {
    return this.fetchData<HealthCheck>('/health');
  }

  // ===== DASHBOARD DATA =====

  async getDashboardData(): Promise<DashboardData> {
    return this.fetchData<DashboardData>('/dashboard');
  }

  async getDashboardMetrics(): Promise<KPI[]> {
    return this.fetchData<KPI[]>('/metrics');
  }

  async getRealTimeData(): Promise<RealTimeData> {
    return this.fetchData<RealTimeData>('/realtime');
  }

  // ===== ENTITY DATA =====

  async getRobots(): Promise<Robot[]> {
    return this.fetchData<Robot[]>('/robots');
  }

  async getPickers(): Promise<Picker[]> {
    return this.fetchData<Picker[]>('/pickers');
  }

  async getCarts(): Promise<Cart[]> {
    return this.fetchData<Cart[]>('/carts');
  }

  async getOrders(): Promise<Order[]> {
    return this.fetchData<Order[]>('/orders');
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return this.fetchData<Order[]>(`/orders/${status}`);
  }

  // ===== TIME-BASED DATA =====

  async getRobotTelemetry(robotId: string, timeRange: string = '24h'): Promise<any[]> {
    return this.fetchData<any[]>(`/robots/${robotId}/telemetry?timeRange=${timeRange}`);
  }

  async getPickerActivity(pickerId: string, timeRange: string = '24h'): Promise<any[]> {
    return this.fetchData<any[]>(`/pickers/${pickerId}/activity?timeRange=${timeRange}`);
  }

  // ===== CONNECTION TEST =====

  async testConnection(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.status === 'healthy';
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// ===== SINGLETON INSTANCE =====

const apiService = new APIService();

// ===== EXPORT =====

export default apiService;
export { APIService };
