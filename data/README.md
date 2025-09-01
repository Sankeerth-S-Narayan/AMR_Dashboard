# Data Directory

This directory contains all data-related files for the AMR Analytics Dashboard.

## 📁 Structure

```
data/
├── types.ts           # TypeScript type definitions
├── syntheticData.ts   # Synthetic data generation logic
└── README.md         # This file
```

## 📊 Data Types

### `types.ts`
Contains TypeScript interfaces for all warehouse entities:
- **Robot**: AMR robot data with status, battery, location, etc.
- **Picker**: Human picker data with performance metrics
- **Cart**: Warehouse cart data with assignments
- **Order**: Order data with items, priority, status
- **KPI**: Key Performance Indicator definitions

### `syntheticData.ts`
Contains functions for generating realistic warehouse data:
- **generateShiftData()**: Creates synthetic data for a shift
- **calculateKPIs()**: Calculates performance metrics from data

## 🔄 Data Flow

1. **Data Generation**: `syntheticData.ts` generates realistic warehouse data
2. **Type Safety**: `types.ts` ensures data consistency
3. **Frontend Usage**: React components import and use this data
4. **Real-time Updates**: Data refreshes every 30 seconds

## 🚀 Usage

```typescript
import { generateShiftData, calculateKPIs } from '../data/syntheticData';
import { Robot, Picker, Cart, Order } from '../data/types';

// Generate data for shift 1
const shiftData = generateShiftData(1);

// Calculate KPIs
const kpis = calculateKPIs(shiftData);
```

## 🔮 Future Enhancements

- **Database Integration**: Replace synthetic data with real warehouse data
- **API Endpoints**: RESTful API for data access
- **Real-time Streaming**: WebSocket connections for live updates
- **Data Validation**: Schema validation and error handling
