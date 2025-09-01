import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Battery, 
  MapPin, 
  Package, 
  TrendingUp, 
  Clock, 
  Users, 
  ShoppingCart,
  Zap,
  BarChart3,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { generateShiftData, calculateKPIs } from '../../data/syntheticData';
import { KPICard } from './components/KPICard';
import { WarehouseMap } from './components/WarehouseMap';
import { Robot, Picker, Cart, Order, KPI } from '../../data/types';

function App() {
  const [currentShift, setCurrentShift] = useState<1 | 2>(1);
  const [shiftData, setShiftData] = useState(() => generateShiftData(1));
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Collapsible state
  const [amrFleetCollapsed, setAmrFleetCollapsed] = useState(false);
  const [pickerPerformanceCollapsed, setPickerPerformanceCollapsed] = useState(false);
  const [warehouseMapCollapsed, setWarehouseMapCollapsed] = useState(false);
  const [orderQueueCollapsed, setOrderQueueCollapsed] = useState(false);

  // Initialize data
  useEffect(() => {
    const data = generateShiftData(currentShift);
    setShiftData(data);
    setKpis(calculateKPIs(data));
    setLastUpdate(new Date());
  }, [currentShift]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const data = generateShiftData(currentShift);
      setShiftData(data);
      setKpis(calculateKPIs(data));
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [currentShift]);

  const { robots, pickers, carts, orders } = shiftData;

  // Calculate summary stats
  const activeRobots = robots.filter(r => r.status === 'active').length;
  const activePickers = pickers.filter(p => p.status === 'active').length;
  const pickersOnBreak = pickers.filter(p => p.status === 'break').length;
  const completedOrders = orders.filter(o => o.status === 'packed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const cartsInUse = carts.filter(c => c.status === 'picking').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'charging':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'maintenance':
        return 'text-red-400 bg-red-400/10';
      case 'break':
        return 'text-blue-400 bg-blue-400/10';
      case 'idle':
        return 'text-gray-400 bg-gray-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'low':
        return 'text-green-400 bg-green-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Collapsible Section Component
  const CollapsibleSection = ({ 
    title, 
    icon: Icon, 
    collapsed, 
    onToggle, 
    children, 
    className = "" 
  }: {
    title: string;
    icon: React.ComponentType<any>;
    collapsed: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`bg-gray-800 rounded-xl border border-gray-700 ${className}`}>
             <button
         onClick={onToggle}
         className="w-full p-6 flex items-center justify-between bg-gray-750 transition-colors rounded-t-xl"
       >
                 <div className="flex items-center gap-2">
           <Icon className="text-blue-400" size={24} />
           <h2 className="text-xl font-bold text-blue-400">{title}</h2>
         </div>
        <ChevronDown 
          className={`text-gray-400 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} 
          size={20} 
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        collapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
      }`}>
        <div className="p-6 pt-0">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white">Warehouse Operations</h1>
        </div>
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-400" size={20} />
            <span className="text-sm text-gray-300">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-green-400" size={16} />
            <span className="text-xs text-gray-400">Active Robots</span>
          </div>
          <p className="text-xl font-bold">{activeRobots}/10</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-blue-400" size={16} />
            <span className="text-xs text-gray-400">Active Pickers</span>
          </div>
          <p className="text-xl font-bold">{activePickers}/8</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="text-purple-400" size={16} />
            <span className="text-xs text-gray-400">Carts in Use</span>
          </div>
          <p className="text-xl font-bold">{cartsInUse}/24</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-green-400" size={16} />
            <span className="text-xs text-gray-400">Completed Orders</span>
          </div>
          <p className="text-xl font-bold">{completedOrders}</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-yellow-400" size={16} />
            <span className="text-xs text-gray-400">Pending Orders</span>
          </div>
          <p className="text-xl font-bold">{pendingOrders}</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-blue-400" size={16} />
            <span className="text-xs text-gray-400">On Break</span>
          </div>
          <p className="text-xl font-bold">{pickersOnBreak}</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          <BarChart3 className="text-blue-400" size={24} />
          Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, index) => (
            <KPICard key={index} kpi={kpi} />
          ))}
        </div>
      </div>

      {/* AMR Fleet Status & Picker Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Robot Fleet Status */}
        <div className="lg:col-span-2">
          <CollapsibleSection
            title="AMR Fleet"
            icon={Zap}
            collapsed={amrFleetCollapsed}
            onToggle={() => setAmrFleetCollapsed(!amrFleetCollapsed)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {robots.map((robot) => (
                <div key={robot.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(robot.status).replace('text-', 'bg-').split(' ')[0]}`}></div>
                      <h3 className="font-semibold text-white">{robot.name}</h3>
                      <span className="text-xs text-gray-400">({robot.id})</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(robot.status)}`}>
                      {robot.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Battery size={14} />
                        Battery
                      </span>
                      <span className="text-white text-sm font-medium">{robot.battery}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          robot.battery > 50 ? 'bg-green-400' : robot.battery > 20 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${robot.battery}%` }}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Tasks: </span>
                        <span className="text-white font-medium">{robot.tasksCompleted}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Distance: </span>
                        <span className="text-white font-medium">{(robot.totalDistance / 1000).toFixed(1)}km</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-xs truncate">
                      Location: {robot.currentLocation}
                    </p>
                    {robot.assignedCart && (
                      <p className="text-blue-300 text-xs">
                        Cart: {robot.assignedCart}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        {/* Picker Status */}
        <div>
          <CollapsibleSection
            title="Picker Performance"
            icon={Users}
            collapsed={pickerPerformanceCollapsed}
            onToggle={() => setPickerPerformanceCollapsed(!pickerPerformanceCollapsed)}
          >
            <div className="space-y-3">
              {pickers.map((picker) => (
                <div key={picker.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(picker.status).replace('text-', 'bg-').split(' ')[0]}`}></div>
                      <h3 className="font-medium text-white">{picker.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(picker.status)}`}>
                      {picker.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <span className="text-gray-400">Picks/hr: </span>
                      <span className="text-white font-medium">{picker.picksPerHour}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total: </span>
                      <span className="text-white font-medium">{picker.totalPicks}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Accuracy: </span>
                      <span className="text-green-400 font-medium">{picker.accuracy.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Carts: </span>
                      <span className="text-white font-medium">{picker.assignedCarts.length}</span>
                    </div>
                  </div>
                  
                  {picker.status === 'break' && picker.breakStartTime && (
                    <p className="text-yellow-400 text-xs">
                      Break: {Math.floor((Date.now() - picker.breakStartTime.getTime()) / 60000)} min
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      </div>

      {/* Warehouse Map */}
      <div className="mb-8">
        <CollapsibleSection
          title="Warehouse Floor Plan"
          icon={MapPin}
          collapsed={warehouseMapCollapsed}
          onToggle={() => setWarehouseMapCollapsed(!warehouseMapCollapsed)}
        >
          <WarehouseMap robots={robots} carts={carts} />
        </CollapsibleSection>
      </div>

      {/* Order Queue */}
      <CollapsibleSection
        title="Order Queue Status"
        icon={Package}
        collapsed={orderQueueCollapsed}
        onToggle={() => setOrderQueueCollapsed(!orderQueueCollapsed)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.slice(0, 12).map((order) => (
            <div key={order.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white text-sm">{order.id}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                  {order.priority}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>{order.items.length} items</span>
                <span>{order.estimatedTime} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'packed' ? 'bg-green-400/10 text-green-400' :
                  order.status === 'picking' ? 'bg-blue-400/10 text-blue-400' :
                  order.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                  'bg-gray-400/10 text-gray-400'
                }`}>
                  {order.status}
                </span>
                {order.assignedPicker && (
                  <span className="text-xs text-blue-300">{order.assignedPicker}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default App;
