import { 
  Order, 
  Robot, 
  Cart, 
  Picker, 
  RobotTelemetry, 
  PickerActivity, 
  OrderEvents, 
  CartMovement,
  ShiftData 
} from './type';

// ===== SHIFT CONFIGURATION =====

const SHIFT_CONFIG = {
  startTime: new Date('2025-09-07T08:00:00'), // 8:00 AM (today)
  endTime: new Date('2025-09-07T14:00:00'),   // 2:00 PM (today)
  duration: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
  
  // Break schedules
  pickerBreakStart: new Date('2025-09-07T11:30:00'), // 11:30 AM (today)
  pickerBreakEnd: new Date('2025-09-07T12:30:00'),   // 12:30 PM (today)
  
  // Entity counts
  robots: 8,
  pickers: 8,
  carts: 20,
  orders: 200
};

// ===== DATA GENERATION FUNCTIONS =====

export class ShiftDataGenerator {
  
  // ===== MONGODB ENTITY GENERATION =====
  
  static generateRobots(): Robot[] {
    return Array.from({ length: SHIFT_CONFIG.robots }, (_, i) => ({
      id: `AMR-${String(i + 1).padStart(3, '0')}`,
      name: `Robot ${i + 1}`,
      maxBattery: 100,
      maxCapacity: 50,
      maintenanceSchedule: 'weekly',
      createdAt: new Date('2024-01-01T00:00:00'),
      updatedAt: new Date('2024-01-15T08:00:00')
    }));
  }
  
  static generatePickers(): Picker[] {
    return Array.from({ length: SHIFT_CONFIG.pickers }, (_, i) => ({
      id: `PICKER-${String(i + 1).padStart(2, '0')}`,
      name: `Picker ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
      shiftSchedule: 'morning',
      maxCartsPerPicker: 2,
      createdAt: new Date('2024-01-01T00:00:00'),
      updatedAt: new Date('2024-01-15T08:00:00')
    }));
  }
  
  static generateCarts(): Cart[] {
    return Array.from({ length: SHIFT_CONFIG.carts }, (_, i) => ({
      id: `CART-${String(i + 1).padStart(3, '0')}`,
      maxCapacity: 50,
      status: 'active',
      createdAt: new Date('2024-01-01T00:00:00'),
      updatedAt: new Date('2024-01-15T08:00:00')
    }));
  }
  
  static generateOrders(): Order[] {
    return Array.from({ length: SHIFT_CONFIG.orders }, (_, i) => {
      const itemCount = Math.floor(Math.random() * 8) + 1; // 1-8 items
      const priority = Math.random() < 0.2 ? 'high' : Math.random() < 0.7 ? 'medium' : 'low';
      
      return {
        id: `ORD-${String(i + 1).padStart(4, '0')}`,
        priority,
        status: 'pending',
        items: Array.from({ length: itemCount }, (_, j) => ({
          id: `ITEM-${String(j + 1).padStart(3, '0')}`,
          name: `Item ${j + 1}`,
          quantity: Math.floor(Math.random() * 3) + 1,
          location: this.generateLocation()
        })),
        estimatedTime: itemCount * 2 + Math.floor(Math.random() * 10),
        createdAt: new Date(SHIFT_CONFIG.startTime.getTime() + Math.random() * SHIFT_CONFIG.duration),
        updatedAt: new Date(SHIFT_CONFIG.startTime.getTime() + Math.random() * SHIFT_CONFIG.duration)
      };
    });
  }
  
  // ===== INFLUXDB TIME-SERIES GENERATION =====
  
  static generateRobotTelemetry(robots: Robot[]): RobotTelemetry[] {
    const telemetry: RobotTelemetry[] = [];
    const timeInterval = 5 * 60 * 1000; // 5 minutes
    
    for (let time = SHIFT_CONFIG.startTime.getTime(); time <= SHIFT_CONFIG.endTime.getTime(); time += timeInterval) {
      const currentTime = new Date(time);
      
      robots.forEach(robot => {
        const isCharging = this.shouldRobotCharge(robot.id, currentTime);
        const battery = this.calculateBatteryLevel(robot.id, currentTime, isCharging);
        const status = this.getRobotStatus(robot.id, currentTime, battery, isCharging);
        
        telemetry.push({
          time: currentTime,
          robot_id: robot.id,
          status,
          location: this.generateLocation(),
          battery,
          tasks_completed: parseFloat(this.calculateTasksCompleted(robot.id, currentTime).toString()),
          total_distance: parseFloat(this.calculateTotalDistance(robot.id, currentTime).toString()),
          assigned_cart: status === 'active' ? this.getAssignedCart(robot.id) : ''
        });
      });
    }
    
    return telemetry;
  }
  
  static generatePickerActivity(pickers: Picker[]): PickerActivity[] {
    const activity: PickerActivity[] = [];
    const timeInterval = 5 * 60 * 1000; // 5 minutes
    
    for (let time = SHIFT_CONFIG.startTime.getTime(); time <= SHIFT_CONFIG.endTime.getTime(); time += timeInterval) {
      const currentTime = new Date(time);
      
      pickers.forEach(picker => {
        const isOnBreak = this.isPickerOnBreak(currentTime);
        const status = isOnBreak ? 'break' : 'active';
        const picksPerHour = isOnBreak ? 0 : this.calculatePicksPerHour(picker.id, currentTime);
        
        activity.push({
          time: currentTime,
          picker_id: picker.id,
          status,
          location: this.generateLocation(),
          picks_per_hour: picksPerHour,
          total_picks: parseFloat(this.calculateTotalPicks(picker.id, currentTime).toString()),
          accuracy: this.calculateAccuracy(picker.id, currentTime),
          assigned_carts: this.getAssignedCarts(picker.id),
          break_duration: isOnBreak ? parseFloat(this.calculateBreakDuration(currentTime).toString()) : 0
        });
      });
    }
    
    return activity;
  }
  
  static generateOrderEvents(orders: Order[]): OrderEvents[] {
    const events: OrderEvents[] = [];
    
    orders.forEach(order => {
      // Order created event
      events.push({
        time: order.createdAt,
        order_id: order.id,
        priority: order.priority,
        status: 'pending',
        item_count: order.items.length,
        estimated_time: order.estimatedTime,
        event_type: 'created'
      });
      
      // Random order processing events
      if (Math.random() > 0.3) { // 70% of orders get processed
        const assignedPicker = this.getRandomPicker();
        const startTime = new Date(order.createdAt.getTime() + Math.random() * 2 * 60 * 60 * 1000); // Within 2 hours
        
        // Order assigned event
        events.push({
          time: startTime,
          order_id: order.id,
          priority: order.priority,
          status: 'picking',
          assigned_picker: assignedPicker,
          item_count: order.items.length,
          estimated_time: order.estimatedTime,
          event_type: 'assigned'
        });
        
        // Order started event
        events.push({
          time: new Date(startTime.getTime() + Math.random() * 30 * 60 * 1000), // Within 30 minutes
          order_id: order.id,
          priority: order.priority,
          status: 'picking',
          assigned_picker: assignedPicker,
          item_count: order.items.length,
          estimated_time: order.estimatedTime,
          event_type: 'started'
        });
        
        // Order completed event (if completed during shift)
        if (Math.random() > 0.4) { // 60% of assigned orders complete
          const completionTime = new Date(startTime.getTime() + order.estimatedTime * 60 * 1000 + Math.random() * 30 * 60 * 1000);
          if (completionTime <= SHIFT_CONFIG.endTime) {
            events.push({
              time: completionTime,
              order_id: order.id,
              priority: order.priority,
              status: 'packed',
              assigned_picker: assignedPicker,
              item_count: parseFloat(order.items.length.toString()),
              estimated_time: parseFloat(order.estimatedTime.toString()),
              actual_time: parseFloat(Math.floor((completionTime.getTime() - startTime.getTime()) / 60000).toString()),
              event_type: 'completed'
            });
          }
        }
      }
    });
    
    return events.sort((a, b) => a.time.getTime() - b.time.getTime());
  }
  
  static generateCartMovement(carts: Cart[]): CartMovement[] {
    const movement: CartMovement[] = [];
    const timeInterval = 10 * 60 * 1000; // 10 minutes
    
    for (let time = SHIFT_CONFIG.startTime.getTime(); time <= SHIFT_CONFIG.endTime.getTime(); time += timeInterval) {
      const currentTime = new Date(time);
      
      carts.forEach(cart => {
        const isInUse = Math.random() > 0.4; // 60% chance of being in use
        const status = isInUse ? 'picking' : 'idle';
        
        movement.push({
          time: currentTime,
          cart_id: cart.id,
          status,
          location: isInUse ? this.generateLocation() : '',
          assigned_picker: isInUse ? this.getRandomPicker() : '',
          assigned_robot: isInUse ? this.getRandomRobot() : '',
          items_in_cart: parseFloat((isInUse ? Math.floor(Math.random() * 20) + 1 : 0).toString()),
          capacity_utilization: parseFloat((isInUse ? Math.floor(Math.random() * 80) + 20 : 0).toString())
        });
      });
    }
    
    return movement;
  }
  
  // ===== HELPER FUNCTIONS =====
  
  private static generateLocation(): string {
    const aisle = Math.floor(Math.random() * 30) + 1;
    const rack = Math.floor(Math.random() * 4) + 1;
    const side = Math.random() > 0.5 ? 'A' : 'B';
    return `A${aisle}-R${rack}-${side}`;
  }
  
  private static shouldRobotCharge(robotId: string, currentTime: Date): boolean {
    // Robots charge when battery is low (below 20%) or during scheduled maintenance
    const battery = this.calculateBatteryLevel(robotId, currentTime, false);
    return battery < 20;
  }
  
  private static calculateBatteryLevel(robotId: string, currentTime: Date, isCharging: boolean): number {
    const robotIndex = parseInt(robotId.split('-')[1]) - 1;
    const timeInShift = (currentTime.getTime() - SHIFT_CONFIG.startTime.getTime()) / (1000 * 60 * 60); // hours
    
    if (isCharging) {
      // Charging: +15% per hour
      return Math.min(100, 20 + (timeInShift * 15));
    } else {
      // Draining: -8% per hour, starting from 85-100%
      const initialBattery = 85 + (robotIndex * 2); // Different starting levels
      return Math.max(0, initialBattery - (timeInShift * 8));
    }
  }
  
  private static getRobotStatus(robotId: string, currentTime: Date, battery: number, isCharging: boolean): 'active' | 'charging' | 'maintenance' | 'idle' {
    if (isCharging) return 'charging';
    if (battery < 20) return 'idle';
    if (Math.random() < 0.05) return 'maintenance'; // 5% chance of maintenance
    return 'active';
  }
  
  private static calculateTasksCompleted(robotId: string, currentTime: Date): number {
    const robotIndex = parseInt(robotId.split('-')[1]) - 1;
    const timeInShift = (currentTime.getTime() - SHIFT_CONFIG.startTime.getTime()) / (1000 * 60 * 60); // hours
    const baseTasks = 10 + (robotIndex * 2); // Different base performance
    return Math.floor(baseTasks + (timeInShift * 3)); // 3 tasks per hour
  }
  
  private static calculateTotalDistance(robotId: string, currentTime: Date): number {
    const robotIndex = parseInt(robotId.split('-')[1]) - 1;
    const timeInShift = (currentTime.getTime() - SHIFT_CONFIG.startTime.getTime()) / (1000 * 60 * 60); // hours
    const baseDistance = 1000 + (robotIndex * 200); // Different base distance
    return Math.floor(baseDistance + (timeInShift * 500)); // 500m per hour
  }
  
  private static getAssignedCart(robotId: string): string {
    const cartIndex = Math.floor(Math.random() * SHIFT_CONFIG.carts) + 1;
    return `CART-${String(cartIndex).padStart(3, '0')}`;
  }
  
  private static isPickerOnBreak(currentTime: Date): boolean {
    return currentTime >= SHIFT_CONFIG.pickerBreakStart && currentTime <= SHIFT_CONFIG.pickerBreakEnd;
  }
  
  private static calculatePicksPerHour(pickerId: string, currentTime: Date): number {
    if (this.isPickerOnBreak(currentTime)) return 0;
    
    const pickerIndex = parseInt(pickerId.split('-')[1]) - 1;
    const timeInShift = (currentTime.getTime() - SHIFT_CONFIG.startTime.getTime()) / (1000 * 60 * 60); // hours
    
    // Performance varies over time (fatigue effect)
    const basePerformance = 100 + (pickerIndex * 5); // Different base performance
    const fatigueFactor = Math.max(0.7, 1 - (timeInShift * 0.1)); // 10% fatigue per hour
    
    return Math.floor(basePerformance * fatigueFactor);
  }
  
  private static calculateTotalPicks(pickerId: string, currentTime: Date): number {
    const pickerIndex = parseInt(pickerId.split('-')[1]) - 1;
    const timeInShift = (currentTime.getTime() - SHIFT_CONFIG.startTime.getTime()) / (1000 * 60 * 60); // hours
    const basePicks = 50 + (pickerIndex * 10); // Different base picks
    
    // Account for break time
    const breakTime = this.isPickerOnBreak(currentTime) ? 0 : 1;
    const activeTime = Math.max(0, timeInShift - (breakTime * 1)); // 1 hour break
    
    return Math.floor(basePicks + (activeTime * 20)); // 20 picks per active hour
  }
  
  private static calculateAccuracy(pickerId: string, currentTime: Date): number {
    const pickerIndex = parseInt(pickerId.split('-')[1]) - 1;
    const timeInShift = (currentTime.getTime() - SHIFT_CONFIG.startTime.getTime()) / (1000 * 60 * 60); // hours
    
    // Accuracy decreases slightly over time due to fatigue
    const baseAccuracy = 98 + (pickerIndex * 0.2); // Different base accuracy
    const fatigueFactor = Math.max(0.95, 1 - (timeInShift * 0.02)); // 2% accuracy loss per hour
    
    return Math.min(100, baseAccuracy * fatigueFactor);
  }
  
  private static getAssignedCarts(pickerId: string): string {
    const cartCount = Math.floor(Math.random() * 2) + 1; // 1-2 carts
    const carts: string[] = [];
    for (let i = 0; i < cartCount; i++) {
      const cartIndex = Math.floor(Math.random() * SHIFT_CONFIG.carts) + 1;
      carts.push(`CART-${String(cartIndex).padStart(3, '0')}`);
    }
    return carts.join(',');
  }
  
  private static calculateBreakDuration(currentTime: Date): number {
    if (!this.isPickerOnBreak(currentTime)) return 0;
    return Math.floor((currentTime.getTime() - SHIFT_CONFIG.pickerBreakStart.getTime()) / (1000 * 60)); // minutes
  }
  
  private static getRandomPicker(): string {
    const pickerIndex = Math.floor(Math.random() * SHIFT_CONFIG.pickers) + 1;
    return `PICKER-${String(pickerIndex).padStart(2, '0')}`;
  }
  
  private static getRandomRobot(): string {
    const robotIndex = Math.floor(Math.random() * SHIFT_CONFIG.robots) + 1;
    return `AMR-${String(robotIndex).padStart(3, '0')}`;
  }
  
  // ===== MAIN GENERATION FUNCTION =====
  
  static generateShiftData(): ShiftData {
    console.log('Generating shift data for 8:00 AM - 2:00 PM...');
    
    // Generate MongoDB entities
    const robots = this.generateRobots();
    const pickers = this.generatePickers();
    const carts = this.generateCarts();
    const orders = this.generateOrders();
    
    // Generate InfluxDB time-series data
    const robotTelemetry = this.generateRobotTelemetry(robots);
    const pickerActivity = this.generatePickerActivity(pickers);
    const orderEvents = this.generateOrderEvents(orders);
    const cartMovement = this.generateCartMovement(carts);
    
    console.log(`Generated ${robots.length} robots, ${pickers.length} pickers, ${carts.length} carts, ${orders.length} orders`);
    console.log(`Generated ${robotTelemetry.length} robot telemetry points, ${pickerActivity.length} picker activity points`);
    console.log(`Generated ${orderEvents.length} order events, ${cartMovement.length} cart movement points`);
    
    return {
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
      shiftStart: SHIFT_CONFIG.startTime,
      shiftEnd: SHIFT_CONFIG.endTime,
      currentTime: new Date()
    };
  }
}
