export interface Robot {
  id: string;
  name: string;
  status: 'active' | 'charging' | 'maintenance' | 'idle';
  battery: number;
  currentLocation: string;
  tasksCompleted: number;
  totalDistance: number;
  assignedCart?: string;
}

export interface Picker {
  id: string;
  name: string;
  status: 'active' | 'break' | 'idle';
  picksPerHour: number;
  totalPicks: number;
  accuracy: number;
  assignedCarts: string[];
  breakStartTime?: Date;
}

export interface Cart {
  id: string;
  status: 'picking' | 'idle' | 'maintenance';
  currentLocation?: string;
  assignedPicker?: string;
  assignedRobot?: string;
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
  startTime?: Date;
  endTime?: Date;
}

export interface KPI {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'productivity' | 'efficiency' | 'quality' | 'utilization';
}
