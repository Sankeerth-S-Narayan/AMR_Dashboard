import { 
  RobotTelemetry, 
  PickerActivity, 
  OrderEvents, 
  CartMovement, 
  KPI 
} from './type';

// ===== DASHBOARD METRICS CALCULATION =====

export class MetricsCalculator {
  
  // ===== QUICK STATS CALCULATION =====
  
  static calculateActiveRobots(robotTelemetry: RobotTelemetry[]): number {
    // Get latest telemetry for each robot
    const latestTelemetry = this.getLatestTelemetry(robotTelemetry);
    return latestTelemetry.filter(rt => rt.status === 'active').length;
  }
  
  static calculateActivePickers(pickerActivity: PickerActivity[]): number {
    // Get latest activity for each picker
    const latestActivity = this.getLatestActivity(pickerActivity);
    return latestActivity.filter(pa => pa.status === 'active').length;
  }
  
  static calculateCartsInUse(cartMovement: CartMovement[]): number {
    // Get latest movement for each cart
    const latestMovement = this.getLatestMovement(cartMovement);
    return latestMovement.filter(cm => cm.status === 'picking').length;
  }
  
  static calculateCompletedOrders(orderEvents: OrderEvents[]): number {
    // Count orders with 'completed' event type
    const completedOrders = new Set(
      orderEvents
        .filter(oe => oe.event_type === 'completed')
        .map(oe => oe.order_id)
    );
    return completedOrders.size;
  }
  
  static calculatePendingOrders(orderEvents: OrderEvents[]): number {
    // Get latest event for each order
    const latestEvents = this.getLatestOrderEvents(orderEvents);
    return latestEvents.filter(oe => oe.status === 'pending').length;
  }
  
  static calculatePickersOnBreak(pickerActivity: PickerActivity[]): number {
    // Get latest activity for each picker
    const latestActivity = this.getLatestActivity(pickerActivity);
    return latestActivity.filter(pa => pa.status === 'break').length;
  }
  
  // ===== KPI CALCULATION =====
  
  static calculateKPIs(
    robotTelemetry: RobotTelemetry[],
    pickerActivity: PickerActivity[],
    orderEvents: OrderEvents[],
    cartMovement: CartMovement[]
  ): KPI[] {
    const activeRobots = this.calculateActiveRobots(robotTelemetry);
    const activePickers = this.calculateActivePickers(pickerActivity);
    const completedOrders = this.calculateCompletedOrders(orderEvents);
    const pendingOrders = this.calculatePendingOrders(orderEvents);
    const cartsInUse = this.calculateCartsInUse(cartMovement);
    
    // Get latest data for calculations
    const latestTelemetry = this.getLatestTelemetry(robotTelemetry);
    const latestActivity = this.getLatestActivity(pickerActivity);
    const latestOrderEvents = this.getLatestOrderEvents(orderEvents);
    
    // Calculate metrics
    const totalPicks = latestActivity.reduce((sum, pa) => sum + pa.total_picks, 0);
    const averageAccuracy = latestActivity.reduce((sum, pa) => sum + pa.accuracy, 0) / latestActivity.length;
    const averagePicksPerHour = latestActivity.reduce((sum, pa) => sum + pa.picks_per_hour, 0) / latestActivity.length;
    const robotUtilization = (activeRobots / latestTelemetry.length) * 100;
    const pickerUtilization = (activePickers / latestActivity.length) * 100;
    const orderFulfillmentRate = (completedOrders / (completedOrders + pendingOrders)) * 100;
    const averageBattery = latestTelemetry.reduce((sum, rt) => sum + rt.battery, 0) / latestTelemetry.length;
    
    return [
      {
        name: 'Orders Completed',
        value: completedOrders,
        unit: 'orders',
        trend: 'up',
        category: 'productivity'
      },
      {
        name: 'Total Picks',
        value: totalPicks,
        unit: 'picks',
        trend: 'up',
        category: 'productivity'
      },
      {
        name: 'Pick Accuracy',
        value: Math.round(averageAccuracy * 10) / 10,
        unit: '%',
        trend: 'stable',
        category: 'quality'
      },
      {
        name: 'Picks Per Hour',
        value: Math.round(averagePicksPerHour),
        unit: 'picks/hr',
        trend: 'up',
        category: 'efficiency'
      },
      {
        name: 'Robot Utilization',
        value: Math.round(robotUtilization * 10) / 10,
        unit: '%',
        trend: 'stable',
        category: 'utilization'
      },
      {
        name: 'Picker Utilization',
        value: Math.round(pickerUtilization * 10) / 10,
        unit: '%',
        trend: 'up',
        category: 'utilization'
      },
      {
        name: 'Order Fulfillment Rate',
        value: Math.round(orderFulfillmentRate * 10) / 10,
        unit: '%',
        trend: 'up',
        category: 'efficiency'
      },
      {
        name: 'Average Battery Level',
        value: Math.round(averageBattery),
        unit: '%',
        trend: 'stable',
        category: 'utilization'
      },
      {
        name: 'Active Robots',
        value: activeRobots,
        unit: 'robots',
        trend: 'stable',
        category: 'utilization'
      },
      {
        name: 'Carts in Use',
        value: cartsInUse,
        unit: 'carts',
        trend: 'up',
        category: 'utilization'
      }
    ];
  }
  
  // ===== HELPER FUNCTIONS =====
  
  private static getLatestTelemetry(robotTelemetry: RobotTelemetry[]): RobotTelemetry[] {
    const latestByRobot = new Map<string, RobotTelemetry>();
    
    robotTelemetry.forEach(rt => {
      const existing = latestByRobot.get(rt.robot_id);
      if (!existing || rt.time > existing.time) {
        latestByRobot.set(rt.robot_id, rt);
      }
    });
    
    return Array.from(latestByRobot.values());
  }
  
  private static getLatestActivity(pickerActivity: PickerActivity[]): PickerActivity[] {
    const latestByPicker = new Map<string, PickerActivity>();
    
    pickerActivity.forEach(pa => {
      const existing = latestByPicker.get(pa.picker_id);
      if (!existing || pa.time > existing.time) {
        latestByPicker.set(pa.picker_id, pa);
      }
    });
    
    return Array.from(latestByPicker.values());
  }
  
  private static getLatestOrderEvents(orderEvents: OrderEvents[]): OrderEvents[] {
    const latestByOrder = new Map<string, OrderEvents>();
    
    orderEvents.forEach(oe => {
      const existing = latestByOrder.get(oe.order_id);
      if (!existing || oe.time > existing.time) {
        latestByOrder.set(oe.order_id, oe);
      }
    });
    
    return Array.from(latestByOrder.values());
  }
  
  private static getLatestMovement(cartMovement: CartMovement[]): CartMovement[] {
    const latestByCart = new Map<string, CartMovement>();
    
    cartMovement.forEach(cm => {
      const existing = latestByCart.get(cm.cart_id);
      if (!existing || cm.time > existing.time) {
        latestByCart.set(cm.cart_id, cm);
      }
    });
    
    return Array.from(latestByCart.values());
  }
  
  // ===== TIME-BASED QUERIES =====
  
  static getRobotPerformanceOverTime(
    robotTelemetry: RobotTelemetry[], 
    robotId: string, 
    timeRange: string
  ): { time: Date; battery: number; tasks: number }[] {
    const cutoffTime = this.getCutoffTime(timeRange);
    
    return robotTelemetry
      .filter(rt => rt.robot_id === robotId && rt.time >= cutoffTime)
      .sort((a, b) => a.time.getTime() - b.time.getTime())
      .map(rt => ({
        time: rt.time,
        battery: rt.battery,
        tasks: rt.tasks_completed
      }));
  }
  
  static getPickerEfficiencyOverTime(
    pickerActivity: PickerActivity[], 
    pickerId: string, 
    timeRange: string
  ): { time: Date; picksPerHour: number; accuracy: number }[] {
    const cutoffTime = this.getCutoffTime(timeRange);
    
    return pickerActivity
      .filter(pa => pa.picker_id === pickerId && pa.time >= cutoffTime)
      .sort((a, b) => a.time.getTime() - b.time.getTime())
      .map(pa => ({
        time: pa.time,
        picksPerHour: pa.picks_per_hour,
        accuracy: pa.accuracy
      }));
  }
  
  private static getCutoffTime(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case '1h': return new Date(now.getTime() - 60 * 60 * 1000);
      case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }
}
