import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPI } from '../../../data/types';

interface KPICardProps {
  kpi: KPI;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <TrendingUp className="text-green-400" size={16} />;
      case 'down':
        return <TrendingDown className="text-red-400" size={16} />;
      default:
        return <Minus className="text-gray-400" size={16} />;
    }
  };

  const getTrendColor = () => {
    switch (kpi.trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getCategoryColor = () => {
    switch (kpi.category) {
      case 'productivity':
        return 'border-blue-500/30 hover:border-blue-500';
      case 'efficiency':
        return 'border-green-500/30 hover:border-green-500';
      case 'quality':
        return 'border-purple-500/30 hover:border-purple-500';
      case 'utilization':
        return 'border-yellow-500/30 hover:border-yellow-500';
      default:
        return 'border-gray-500/30 hover:border-gray-500';
    }
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-4 border transition-all duration-200 ${getCategoryColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{kpi.name}</h3>
        {getTrendIcon()}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">
          {kpi.value.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400">{kpi.unit}</span>
      </div>
    </div>
  );
};
