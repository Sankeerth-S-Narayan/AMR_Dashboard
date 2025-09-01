# AMR Analytics Dashboard - Frontend

This directory contains the frontend application for the AMR Analytics Dashboard.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── KPICard.tsx     # KPI display component
│   │   └── WarehouseMap.tsx # Interactive warehouse map
│   ├── data/               # Data management
│   │   └── syntheticData.ts # Synthetic data generation
│   ├── types/              # TypeScript type definitions
│   │   └── warehouse.ts    # Warehouse entity types
│   ├── styles/             # Styling files
│   │   └── index.css       # Main CSS with Tailwind
│   ├── utils/              # Utility functions (future use)
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── eslint.config.js        # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 🛠 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **ESLint** - Code linting

## 📊 Features

- **Real-time Dashboard** - Live monitoring of warehouse operations
- **Collapsible Sections** - Interactive UI with smooth animations
- **Responsive Design** - Works on desktop and mobile devices
- **Type Safety** - Full TypeScript implementation
- **Modern UI** - Dark theme with professional styling

## 🔧 Development

### Component Structure
- **App.tsx** - Main application with collapsible sections
- **KPICard.tsx** - Reusable KPI display component
- **WarehouseMap.tsx** - Interactive warehouse floor plan

### Data Flow
- Synthetic data generation in `data/syntheticData.ts`
- Type definitions in `types/warehouse.ts`
- Real-time updates every 30 seconds

### Styling
- Tailwind CSS for utility classes
- Custom color palette for warehouse theme
- Responsive grid layouts
- Smooth animations and transitions
