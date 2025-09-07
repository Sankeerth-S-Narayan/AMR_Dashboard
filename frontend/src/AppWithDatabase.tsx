import React, { useState } from 'react';
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
  ChevronDown,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { KPICard } from './components/KPICard';
import { WarehouseMap } from './components/WarehouseMap';
import useDashboardData from './hooks/useDashboardData';

function AppWithDatabase() {
  // Use the database hook
  const {
    dashboardData,
    metrics,
    realTimeData,
    health,
    loading,
    error,
    lastUpdate,
    refreshData,
    isConnected,
    hasData,
    robots,
    pickers,
    carts,
    orders,
    activeRobots,
    activePickers,
    cartsInUse,
    completedOrders,
    pendingOrders,
    pickersOnBreak
  } = useDashboardData();

  // Collapsible state
  const [amrFleetCollapsed, setAmrFleetCollapsed] = useState(false);
  const [pickerPerformanceCollapsed, setPickerPerformanceCollapsed] = useState(false);
  const [warehouseMapCollapsed, setWarehouseMapCollapsed] = useState(false);
  const [orderQueueCollapsed, setOrderQueueCollapsed] = useState(false);

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

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-full min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-blue-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Loading Dashboard Data</h2>
          <p className="text-gray-400">Connecting to databases...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <WifiOff className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!hasData) {
    return (
      <div className="w-full h-full min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Package className="text-gray-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">No Data Available</h2>
          <p className="text-gray-400">Please ensure databases are populated with data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white">Warehouse Operations</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            {isConnected ? (
              <Wifi className="text-green-400" size={16} />
            ) : (
              <WifiOff className="text-red-400" size={16} />
            )}
            <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Connected to Database' : 'Database Disconnected'}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={refreshData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh Data
            </button>
            {health && (
              <div className="text-sm text-gray-400">
                <span>MongoDB: {health.databases.mongodb ? '✅' : '❌'}</span>
                <span className="ml-2">InfluxDB: {health.databases.influxdb ? '✅' : '❌'}</span>
              </div>
            )}
          </div>
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
          <p className="text-xl font-bold">{activeRobots}/8</p>
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
          <p className="text-xl font-bold">{cartsInUse}/20</p>
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
          {metrics.filter(kpi => kpi !== null && kpi !== undefined).map((kpi, index) => (
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
                <div key={`amr-fleet-robot-${robot.id}`} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <h3 className="font-semibold text-white">{robot.name}</h3>
                      <span className="text-xs text-gray-400">({robot.id})</span>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-green-400 bg-green-400/10">
                      active
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Battery size={14} />
                        Battery
                      </span>
                      <span className="text-white text-sm font-medium">85%</span>
                    </div>
                    
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500 bg-green-400"
                        style={{ width: '85%' }}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Tasks: </span>
                        <span className="text-white font-medium">25</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Distance: </span>
                        <span className="text-white font-medium">3.5km</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-xs truncate">
                      Location: A1-R1-A
                    </p>
                    <p className="text-blue-300 text-xs">
                      Cart: CART-001
                    </p>
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
                <div key={`picker-performance-${picker.id}`} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <h3 className="font-medium text-white">{picker.name}</h3>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-green-400 bg-green-400/10">
                      active
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <span className="text-gray-400">Picks/hr: </span>
                      <span className="text-white font-medium">110</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total: </span>
                      <span className="text-white font-medium">250</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Accuracy: </span>
                      <span className="text-green-400 font-medium">98.5%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Carts: </span>
                      <span className="text-white font-medium">2</span>
                    </div>
                  </div>
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

export default AppWithDatabase;
