# Database to Frontend Integration Guide

## 🚀 **Complete Integration Setup**

This guide will help you connect your databases to the frontend to display real metrics from the warehouse data.

## 📋 **Prerequisites**

### **1. Database Setup Complete**
- ✅ MongoDB running and populated
- ✅ InfluxDB running and populated
- ✅ Data generated using `npm run populate`

### **2. Required Software**
- Node.js 16+
- MongoDB
- InfluxDB
- npm/yarn

## 🔧 **Step-by-Step Setup**

### **Step 1: Install Database Dependencies**

```bash
# Navigate to data directory
cd data

# Install dependencies
npm install
```

### **Step 2: Start the API Server**

```bash
# Start the API server (in data directory)
npm run server
```

The server will start on `http://localhost:3001` and provide these endpoints:
- `GET /api/health` - Health check
- `GET /api/dashboard` - Complete dashboard data
- `GET /api/metrics` - Dashboard metrics
- `GET /api/realtime` - Real-time data
- `GET /api/robots` - All robots
- `GET /api/pickers` - All pickers
- `GET /api/carts` - All carts
- `GET /api/orders` - All orders

### **Step 3: Start the Frontend**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📊 **What You'll See**

### **Dashboard Features:**
- ✅ **Real-time metrics** from database
- ✅ **Connection status** indicator
- ✅ **Database health** monitoring
- ✅ **Auto-refresh** every 30 seconds
- ✅ **Manual refresh** button
- ✅ **Error handling** with retry options

### **Data Displayed:**
- **Quick Stats**: Active robots, pickers, carts, orders
- **KPI Overview**: All 10 performance metrics
- **AMR Fleet**: Robot status and telemetry
- **Picker Performance**: Activity and efficiency
- **Warehouse Map**: Robot and cart locations
- **Order Queue**: Order status and processing

## 🔍 **Verification Steps**

### **1. Check API Server**
```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Expected response:
{
  "status": "healthy",
  "databases": {
    "mongodb": true,
    "influxdb": true
  },
  "data": {
    "robots": 8,
    "pickers": 8,
    "carts": 20,
    "orders": 200
  }
}
```

### **2. Check Frontend Connection**
- Open `http://localhost:5173`
- Look for green "Connected to Database" status
- Verify data is loading (not showing loading spinner)
- Check that metrics show real values

### **3. Test Real-time Updates**
- Wait 30 seconds and verify data updates
- Use the "Refresh Data" button
- Check that timestamps update

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. API Server Won't Start**
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Check if InfluxDB is running
curl http://localhost:8086/health

# Check database connections
npm run status
```

#### **2. Frontend Shows "Connection Error"**
- Ensure API server is running on port 3001
- Check browser console for CORS errors
- Verify API endpoints are accessible

#### **3. No Data Displayed**
- Check if databases are populated: `npm run status`
- Verify API health endpoint returns data
- Check browser network tab for failed requests

#### **4. Data Not Updating**
- Check API server logs for errors
- Verify InfluxDB time-series data exists
- Test individual API endpoints

### **Debug Commands:**

```bash
# Check database status
cd data && npm run status

# Test API endpoints
curl http://localhost:3001/api/health
curl http://localhost:3001/api/metrics
curl http://localhost:3001/api/realtime

# Check frontend console
# Open browser dev tools and check console for errors
```

## 📈 **Data Flow**

```
MongoDB + InfluxDB → API Server → Frontend Dashboard
     ↓                    ↓              ↓
Entity Data         REST API        React Components
Time-Series Data    JSON Response   Real-time Updates
```

## 🔄 **Real-time Updates**

The system provides:
- **Automatic updates** every 30 seconds
- **Manual refresh** button
- **Connection status** monitoring
- **Error handling** with retry options

## 🎯 **Expected Results**

### **Dashboard Metrics:**
- **Active Robots**: 6/8 (realistic during shift)
- **Active Pickers**: 0/8 during break (11:30-12:30), 8/8 otherwise
- **Carts in Use**: ~12/20 (60% utilization)
- **Completed Orders**: 45+ orders
- **Pending Orders**: 155+ orders
- **All KPI Metrics**: Calculated from real data

### **Visual Indicators:**
- ✅ Green connection status
- ✅ Database health indicators
- ✅ Real-time data timestamps
- ✅ Loading states and error handling

## 🚀 **Next Steps**

1. **Verify Integration**: Ensure all data displays correctly
2. **Test Real-time**: Verify 30-second updates work
3. **Monitor Performance**: Check for any performance issues
4. **Add Features**: Implement additional analytics or alerts
5. **Deploy**: Consider production deployment strategies

## 📝 **Files Created/Modified:**

### **Backend (Data Layer):**
- `data/apiService.ts` - API service for database access
- `data/server.ts` - Express server with REST endpoints
- `data/package.json` - Updated with server dependencies

### **Frontend:**
- `frontend/src/services/apiService.ts` - Frontend API client
- `frontend/src/hooks/useDashboardData.ts` - React hook for data management
- `frontend/src/AppWithDatabase.tsx` - Updated App component
- `frontend/src/main.tsx` - Updated to use new App component

## ✅ **Success Indicators**

When everything is working correctly, you should see:
- ✅ API server running on port 3001
- ✅ Frontend running on port 5173
- ✅ Green "Connected to Database" status
- ✅ Real metrics displaying (not zeros or loading)
- ✅ Data updating every 30 seconds
- ✅ All dashboard sections populated with data

Your warehouse analytics dashboard is now connected to real database data! 🎉
