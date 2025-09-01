# AMR Analytics Dashboard

A real-time warehouse operations dashboard for monitoring Autonomous Mobile Robots (AMRs) and human picker performance in modern fulfillment centers.

## 🚀 Features

### Real-time Monitoring
- **AMR Fleet Status**: Live tracking of 10 robots with battery levels, status, and location
- **Picker Performance**: Monitor 8 human pickers with efficiency metrics and break status
- **Order Queue Management**: Track 150+ orders with priority levels and real-time status
- **Warehouse Floor Plan**: Interactive map showing robot and cart positions

### Key Performance Indicators
- Orders completed per shift
- Pick accuracy percentages
- Picks per hour efficiency
- Robot utilization rates
- Battery level monitoring
- Cart utilization tracking

### Interactive Features
- **Collapsible Sections**: Expand/collapse dashboard sections for better organization
- **Real-time Updates**: Data refreshes every 30 seconds automatically
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Professional dark interface optimized for warehouse environments

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Development Tools
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
AMR Analytics/
├── frontend/                 # Frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── KPICard.tsx   # KPI display component
│   │   │   └── WarehouseMap.tsx # Interactive warehouse map
│   │   ├── data/             # Data management
│   │   │   └── syntheticData.ts # Synthetic data generation
│   │   ├── types/            # TypeScript definitions
│   │   │   └── warehouse.ts  # Warehouse entity types
│   │   ├── styles/           # Styling files
│   │   │   └── index.css     # Main CSS with Tailwind
│   │   ├── utils/            # Utility functions
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Application entry point
│   ├── public/               # Static assets
│   ├── index.html            # HTML entry point
│   ├── package.json          # Dependencies and scripts
│   ├── vite.config.ts        # Vite configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── postcss.config.js     # PostCSS configuration
│   └── eslint.config.js      # ESLint configuration
├── README.md                 # Project documentation
└── .gitignore               # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "AMR Analytics"
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

### Development

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The dashboard will automatically load with real-time data

### Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

## 📊 Dashboard Sections

### Overview (KPI Cards)
- **Orders Completed**: Total orders processed
- **Total Picks**: Total items picked
- **Pick Accuracy**: Average pick accuracy percentage
- **Picks Per Hour**: Average picking efficiency
- **Robot Utilization**: Percentage of active robots
- **Picker Utilization**: Percentage of active pickers
- **Order Fulfillment Rate**: Percentage of completed orders
- **Average Battery Level**: Mean robot battery percentage
- **Active Robots**: Number of currently active robots
- **Carts in Use**: Number of carts currently in use

### AMR Fleet
- **Robot Status**: Active, charging, maintenance, or idle
- **Battery Levels**: Real-time battery percentage with color coding
- **Task Completion**: Number of tasks completed per robot
- **Distance Traveled**: Total distance covered by each robot
- **Current Location**: Warehouse location coordinates
- **Assigned Carts**: Cart assignments for active robots

### Picker Performance
- **Picker Status**: Active, break, or idle
- **Picks Per Hour**: Individual picker efficiency
- **Total Picks**: Cumulative picks for the shift
- **Accuracy**: Individual picker accuracy percentage
- **Assigned Carts**: Number of carts assigned to each picker
- **Break Time**: Duration of current break (if applicable)

### Warehouse Floor Plan
- **Interactive Map**: Visual representation of warehouse layout
- **Robot Positions**: Real-time robot locations with status indicators
- **Cart Positions**: Current cart locations
- **Aisle Layout**: 30 aisles with 4 racks each
- **Status Legend**: Color-coded status indicators

### Order Queue Status
- **Order Priority**: High, medium, or low priority levels
- **Order Status**: Pending, picking, or packed
- **Item Count**: Number of items per order
- **Estimated Time**: Expected completion time
- **Assigned Picker**: Picker assigned to each order

## 🔧 Data Management

### Synthetic Data Generation
- **Real-time Simulation**: Data updates every 30 seconds
- **Realistic Metrics**: Based on typical warehouse operations
- **Dynamic Values**: Random variations for realistic simulation
- **Status Changes**: Robots and pickers change status dynamically

### Data Types
- **Robots**: 10 AMR robots with various statuses
- **Pickers**: 8 human pickers with performance metrics
- **Carts**: 24 carts with location tracking
- **Orders**: 150+ orders with priority and status

## 🎨 UI/UX Features

### Design System
- **Dark Theme**: Optimized for warehouse environments
- **Color Coding**: Status-based color indicators
- **Responsive Grid**: Adaptive layouts for different screen sizes
- **Smooth Animations**: CSS transitions and hover effects

### Interactive Elements
- **Collapsible Sections**: Click to expand/collapse dashboard sections
- **Hover Effects**: Interactive feedback on cards and buttons
- **Real-time Updates**: Live data refresh without page reload
- **Status Indicators**: Visual status representation

## 🚀 Performance

### Optimization
- **React 18**: Latest React features for optimal performance
- **Vite**: Fast development and build times
- **Tailwind CSS**: Optimized CSS with PurgeCSS
- **TypeScript**: Compile-time error checking

### Real-time Features
- **30-second Updates**: Automatic data refresh
- **Smooth Animations**: 60fps transitions
- **Responsive Design**: Works on all device sizes
- **Efficient Rendering**: Optimized React components

## 🔮 Future Enhancements

### Planned Features
- **Database Integration**: Real warehouse data connection
- **User Authentication**: Role-based access control
- **Historical Analytics**: Trend analysis and reporting
- **Alert System**: Real-time notifications for issues
- **Mobile App**: Native mobile application
- **API Integration**: RESTful API for external systems

### Technical Improvements
- **Backend Development**: Node.js/Express server
- **Database Design**: PostgreSQL with real-time capabilities
- **WebSocket Integration**: Real-time data streaming
- **Testing Suite**: Unit and integration tests
- **CI/CD Pipeline**: Automated deployment

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the frontend directory

---

**AMR Analytics Dashboard** - Empowering warehouse operations with real-time insights and intelligent monitoring.
