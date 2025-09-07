import express from 'express';
import cors from 'cors';
import { getAPIService } from './apiService';

// ===== EXPRESS SERVER SETUP =====

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Get API service instance
const apiService = getAPIService();

// ===== API ROUTES =====

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const health = await apiService.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Dashboard data endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    const dashboardData = await apiService.getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data' 
    });
  }
});

// Dashboard metrics endpoint
app.get('/api/metrics', async (req, res) => {
  try {
    const metrics = await apiService.getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch metrics' 
    });
  }
});

// Real-time data endpoint
app.get('/api/realtime', async (req, res) => {
  try {
    const realTimeData = await apiService.getRealTimeData();
    res.json(realTimeData);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch real-time data' 
    });
  }
});

// Entity data endpoints
app.get('/api/robots', async (req, res) => {
  try {
    const robots = await apiService.getRobots();
    res.json(robots);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch robots' 
    });
  }
});

app.get('/api/pickers', async (req, res) => {
  try {
    const pickers = await apiService.getPickers();
    res.json(pickers);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch pickers' 
    });
  }
});

app.get('/api/carts', async (req, res) => {
  try {
    const carts = await apiService.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch carts' 
    });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await apiService.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch orders' 
    });
  }
});

app.get('/api/orders/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await apiService.getOrdersByStatus(status);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch orders by status' 
    });
  }
});

// Time-based data endpoints
app.get('/api/robots/:robotId/telemetry', async (req, res) => {
  try {
    const { robotId } = req.params;
    const { timeRange = '24h' } = req.query;
    const telemetry = await apiService.getRobotTelemetryOverTime(robotId, timeRange as string);
    res.json(telemetry);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch robot telemetry' 
    });
  }
});

app.get('/api/pickers/:pickerId/activity', async (req, res) => {
  try {
    const { pickerId } = req.params;
    const { timeRange = '24h' } = req.query;
    const activity = await apiService.getPickerActivityOverTime(pickerId, timeRange as string);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch picker activity' 
    });
  }
});

// ===== ERROR HANDLING =====

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl 
  });
});

// ===== SERVER STARTUP =====

async function startServer() {
  try {
    // Connect to databases
    await apiService.connect();
    
    // Start server
    app.listen(port, () => {
      console.log('🚀 AMR Analytics API Server started');
      console.log(`📡 Server running on http://localhost:${port}`);
      console.log('📊 Available endpoints:');
      console.log('  GET /api/health - Health check');
      console.log('  GET /api/dashboard - Complete dashboard data');
      console.log('  GET /api/metrics - Dashboard metrics');
      console.log('  GET /api/realtime - Real-time data');
      console.log('  GET /api/robots - All robots');
      console.log('  GET /api/pickers - All pickers');
      console.log('  GET /api/carts - All carts');
      console.log('  GET /api/orders - All orders');
      console.log('  GET /api/orders/:status - Orders by status');
      console.log('  GET /api/robots/:robotId/telemetry - Robot telemetry');
      console.log('  GET /api/pickers/:pickerId/activity - Picker activity');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ===== GRACEFUL SHUTDOWN =====

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await apiService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await apiService.disconnect();
  process.exit(0);
});

// ===== START SERVER =====

if (require.main === module) {
  startServer();
}

export { app, startServer };
