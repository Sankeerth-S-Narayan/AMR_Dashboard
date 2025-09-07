import { useState, useEffect, useCallback } from 'react';
import apiService, { DashboardData, KPI, RealTimeData, HealthCheck } from '../services/apiService';

// ===== DASHBOARD DATA HOOK =====

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [metrics, setMetrics] = useState<KPI[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // ===== DATA FETCHING FUNCTIONS =====

  const fetchDashboardData = useCallback(async () => {
    try {
      const data = await apiService.getDashboardData();
      setDashboardData(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    }
  }, []);

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await apiService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    }
  }, []);

  const fetchRealTimeData = useCallback(async () => {
    try {
      const data = await apiService.getRealTimeData();
      setRealTimeData(data);
    } catch (err) {
      console.error('Failed to fetch real-time data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch real-time data');
    }
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const data = await apiService.healthCheck();
      setHealth(data);
    } catch (err) {
      console.error('Failed to fetch health check:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch health check');
    }
  }, []);

  // ===== INITIAL DATA LOAD =====

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Test connection first
        const isConnected = await apiService.testConnection();
        if (!isConnected) {
          throw new Error('Cannot connect to API server. Please ensure the server is running.');
        }

        // Fetch all data in parallel
        await Promise.all([
          fetchDashboardData(),
          fetchMetrics(),
          fetchRealTimeData(),
          fetchHealth()
        ]);
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [fetchDashboardData, fetchMetrics, fetchRealTimeData, fetchHealth]);

  // ===== REAL-TIME UPDATES =====

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Update real-time data every 30 seconds
        await Promise.all([
          fetchRealTimeData(),
          fetchMetrics(),
          fetchHealth()
        ]);
      } catch (err) {
        console.error('Failed to update real-time data:', err);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchRealTimeData, fetchMetrics, fetchHealth]);

  // ===== MANUAL REFRESH =====

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchDashboardData(),
        fetchMetrics(),
        fetchRealTimeData(),
        fetchHealth()
      ]);
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardData, fetchMetrics, fetchRealTimeData, fetchHealth]);

  // ===== RETURN HOOK DATA =====

  return {
    // Data
    dashboardData,
    metrics,
    realTimeData,
    health,
    
    // State
    loading,
    error,
    lastUpdate,
    
    // Actions
    refreshData,
    
    // Computed values
    isConnected: health?.status === 'healthy',
    hasData: dashboardData !== null && metrics.length > 0,
    
    // Quick access to common data
    robots: dashboardData?.robots || [],
    pickers: dashboardData?.pickers || [],
    carts: dashboardData?.carts || [],
    orders: dashboardData?.orders || [],
    
    // Quick access to real-time metrics
    activeRobots: realTimeData?.activeRobots || 0,
    activePickers: realTimeData?.activePickers || 0,
    cartsInUse: realTimeData?.cartsInUse || 0,
    completedOrders: realTimeData?.completedOrders || 0,
    pendingOrders: realTimeData?.pendingOrders || 0,
    pickersOnBreak: realTimeData?.pickersOnBreak || 0
  };
}

// ===== EXPORT =====

export default useDashboardData;
