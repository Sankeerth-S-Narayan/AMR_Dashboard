import { Cart, Picker, Robot, Order, OrderItem, KPI } from './types';

// Generate synthetic data for a shift
export const generateShiftData = (shiftNumber: 1 | 2) => {
  const shiftStart = shiftNumber === 1 
    ? new Date('2024-01-15T06:00:00') 
    : new Date('2024-01-15T14:00:00');
  
  const shiftEnd = new Date(shiftStart.getTime() + 8 * 60 * 60 * 1000); // 8 hours

  // Generate Carts
  const carts: Cart[] = Array.from({ length: 24 }, (_, i) => {
    const cartId = `CART-${String(i + 1).padStart(3, '0')}`;
    const statuses: Cart['status'][] = ['picking', 'idle', 'maintenance'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: cartId,
      status,
      assignedPicker: status === 'picking' ? `PICKER-${String(Math.floor(i / 3) + 1).padStart(2, '0')}` : undefined,
      currentLocation: status === 'picking' ? `A${Math.floor(Math.random() * 30) + 1}-R${Math.floor(Math.random() * 4) + 1}-${Math.random() > 0.5 ? 'A' : 'B'}` : undefined,
      assignedRobot: status === 'picking' ? `AMR-${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}` : undefined
    };
  });

  // Generate Pickers
  const pickers: Picker[] = Array.from({ length: 8 }, (_, i) => {
    const pickerId = `PICKER-${String(i + 1).padStart(2, '0')}`;
    const assignedCartIds = carts
      .filter(cart => cart.assignedPicker === pickerId)
      .map(cart => cart.id);
    
    const isOnBreak = Math.random() > 0.8; // 20% chance of being on break
    
    return {
      id: pickerId,
      name: `Picker ${String.fromCharCode(65 + i)}`, // Picker A, B, C, etc.
      status: isOnBreak ? 'break' : (assignedCartIds.length > 0 ? 'active' : 'idle'),
      picksPerHour: Math.floor(Math.random() * 50) + 80, // 80-130 picks per hour
      totalPicks: Math.floor(Math.random() * 200) + 150, // 150-350 picks per shift
      accuracy: Math.random() * 5 + 95, // 95-100% accuracy
      assignedCarts: assignedCartIds,
      breakStartTime: isOnBreak ? new Date(Date.now() - Math.random() * 30 * 60 * 1000) : undefined
    };
  });

  // Generate Robots
  const robots: Robot[] = Array.from({ length: 10 }, (_, i) => {
    const robotId = `AMR-${String(i + 1).padStart(3, '0')}`;
    const statuses: Robot['status'][] = ['active', 'charging', 'maintenance', 'idle'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: robotId,
      name: `Robot ${i + 1}`,
      status,
      battery: status === 'charging' 
        ? Math.floor(Math.random() * 30) + 10 
        : Math.floor(Math.random() * 60) + 40,
      currentLocation: `A${Math.floor(Math.random() * 30) + 1}-R${Math.floor(Math.random() * 4) + 1}-${Math.random() > 0.5 ? 'A' : 'B'}`,
      assignedCart: status === 'active' ? carts.find(c => c.assignedRobot === robotId)?.id : undefined,
      tasksCompleted: Math.floor(Math.random() * 30) + 10,
      totalDistance: Math.floor(Math.random() * 5000) + 2000 // 2-7 km per shift
    };
  });

  // Generate Orders
  const orders: Order[] = Array.from({ length: 150 }, (_, i) => {
    const orderId = `ORD-${String(i + 1).padStart(4, '0')}`;
    const priorities: Order['priority'][] = ['high', 'medium', 'low'];
    const statuses: Order['status'][] = ['pending', 'picking', 'packed'];
    
    const itemCount = Math.floor(Math.random() * 8) + 1; // 1-8 items per order
    const items: OrderItem[] = Array.from({ length: itemCount }, (_, j) => ({
      id: `ITEM-${String(j + 1).padStart(3, '0')}`,
      name: `Item ${j + 1}`,
      quantity: Math.floor(Math.random() * 3) + 1,
      location: `A${Math.floor(Math.random() * 30) + 1}-R${Math.floor(Math.random() * 4) + 1}-${Math.random() > 0.5 ? 'A' : 'B'}`
    }));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const estimatedTime = itemCount * 2 + Math.floor(Math.random() * 10); // 2 min per item + random
    
    return {
      id: orderId,
      items,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      assignedPicker: status !== 'pending' ? pickers[Math.floor(Math.random() * pickers.length)].id : undefined,
      startTime: status !== 'pending' ? new Date(shiftStart.getTime() + Math.random() * 4 * 60 * 60 * 1000) : undefined,
      endTime: status === 'packed' ? new Date(shiftStart.getTime() + Math.random() * 6 * 60 * 60 * 1000) : undefined,
      estimatedTime
    };
  });

  return { carts, pickers, robots, orders, shiftStart, shiftEnd };
};

// Calculate KPIs from the data
export const calculateKPIs = (data: ReturnType<typeof generateShiftData>): KPI[] => {
  const { carts, pickers, robots, orders } = data;
  
  const completedOrders = orders.filter(o => o.status === 'packed').length;
  const totalPicks = pickers.reduce((sum, p) => sum + p.totalPicks, 0);
  const activeRobots = robots.filter(r => r.status === 'active').length;
  const activePickers = pickers.filter(p => p.status === 'active').length;
  const averageAccuracy = pickers.reduce((sum, p) => sum + p.accuracy, 0) / pickers.length;
  const averagePicksPerHour = pickers.reduce((sum, p) => sum + p.picksPerHour, 0) / pickers.length;
  const robotUtilization = (activeRobots / robots.length) * 100;
  const pickerUtilization = (activePickers / pickers.length) * 100;
  const orderFulfillmentRate = (completedOrders / orders.length) * 100;
  const averageBattery = robots.reduce((sum, r) => sum + r.battery, 0) / robots.length;

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
      value: carts.filter(c => c.status === 'picking').length,
      unit: 'carts',
      trend: 'up',
      category: 'utilization'
    }
  ];
};
