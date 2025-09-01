import React from 'react';
import { Robot, Cart } from '../../../data/types';

interface WarehouseMapProps {
  robots: Robot[];
  carts: Cart[];
}

export const WarehouseMap: React.FC<WarehouseMapProps> = ({ robots, carts }) => {
  // Generate warehouse layout (30 aisles, 4 racks per aisle)
  const aisles = Array.from({ length: 30 }, (_, i) => i + 1);
  const racks = Array.from({ length: 4 }, (_, i) => i + 1);

  const getLocationCoordinates = (location: string) => {
    const match = location.match(/A(\d+)-R(\d+)-([AB])/);
    if (!match) return { x: 0, y: 0 };
    
    const aisle = parseInt(match[1]);
    const rack = parseInt(match[2]);
    const side = match[3];
    
    const x = (aisle - 1) * 25 + (side === 'B' ? 12 : 0);
    const y = (rack - 1) * 40 + 20;
    
    return { x, y };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-400';
      case 'charging':
        return 'bg-yellow-400';
      case 'maintenance':
        return 'bg-red-400';
      case 'idle':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4 relative overflow-auto" style={{ height: '400px' }}>
      {/* Warehouse grid */}
      <svg width="750" height="200" className="absolute inset-0">
        {/* Aisles */}
        {aisles.map(aisle => (
          <g key={aisle}>
            {/* Aisle lines */}
            <line
              x1={(aisle - 1) * 25}
              y1={0}
              x2={(aisle - 1) * 25}
              y2={200}
              stroke="#374151"
              strokeWidth="1"
            />
            {/* Aisle labels */}
            <text
              x={(aisle - 1) * 25 + 12}
              y={15}
              fill="#9CA3AF"
              fontSize="10"
              textAnchor="middle"
            >
              A{aisle}
            </text>
            
            {/* Racks */}
            {racks.map(rack => (
              <g key={`${aisle}-${rack}`}>
                {/* Side A */}
                <rect
                  x={(aisle - 1) * 25 + 2}
                  y={(rack - 1) * 40 + 20}
                  width={8}
                  height={30}
                  fill="#4B5563"
                  stroke="#6B7280"
                />
                {/* Side B */}
                <rect
                  x={(aisle - 1) * 25 + 14}
                  y={(rack - 1) * 40 + 20}
                  width={8}
                  height={30}
                  fill="#4B5563"
                  stroke="#6B7280"
                />
              </g>
            ))}
          </g>
        ))}
      </svg>

      {/* Robots */}
      {robots.map(robot => {
        const coords = getLocationCoordinates(robot.currentLocation);
        return (
          <div
            key={robot.id}
            className={`absolute w-3 h-3 rounded-full ${getStatusColor(robot.status)} transition-all duration-1000`}
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            title={`${robot.name} - ${robot.status} - Battery: ${robot.battery}%`}
          >
            {robot.status === 'active' && (
              <div className="absolute -inset-1 bg-green-400/30 rounded-full animate-ping"></div>
            )}
          </div>
        );
      })}

      {/* Carts */}
      {carts.filter(cart => cart.currentLocation).map(cart => {
        const coords = getLocationCoordinates(cart.currentLocation!);
        return (
          <div
            key={cart.id}
            className="absolute w-2 h-2 bg-blue-400 rounded-sm"
            style={{
              left: `${coords.x + 5}px`,
              top: `${coords.y + 5}px`,
              transform: 'translate(-50%, -50%)'
            }}
            title={`${cart.id} - ${cart.status}`}
          />
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 rounded-lg p-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-300">Active Robot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-300">Charging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-gray-300">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-sm"></div>
            <span className="text-gray-300">Cart</span>
          </div>
        </div>
      </div>
    </div>
  );
};
