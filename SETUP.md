# AMR Analytics Dashboard - Setup Guide

## 🚀 Quick Start

This guide will help you set up the AMR Analytics Dashboard project with both frontend and backend environments.

## 📋 Prerequisites

- **Python 3.8+** (for backend/data processing)
- **Node.js 16+** (for frontend)
- **Git** (for version control)

## 🐍 Python Environment Setup

### 1. Create Virtual Environment

```bash
# Navigate to project root
cd "AMR Analytics"

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Python Dependencies

```bash
# Install all Python packages
pip install -r requirements.txt

# Or install core packages only (faster)
pip install fastapi uvicorn pandas numpy python-dotenv
```

### 3. Verify Python Setup

```bash
# Check Python version
python --version

# Check installed packages
pip list
```

## ⚛️ Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Node.js Dependencies

```bash
# Install all dependencies
npm install

# Or if you prefer yarn:
yarn install
```

### 3. Verify Frontend Setup

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0
```

## 🔧 Development Environment

### Frontend Development

```bash
# Start development server
cd frontend
npm run dev

# The dashboard will be available at:
# http://localhost:5173
```

### Backend Development (Future)

```bash
# Start FastAPI server (when backend is implemented)
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# API will be available at:
# http://localhost:8000
# API docs at: http://localhost:8000/docs
```

## 📁 Project Structure

```
AMR Analytics/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/          # CSS styles
│   │   └── main.tsx         # App entry point
│   ├── package.json         # Node.js dependencies
│   └── vite.config.ts       # Vite configuration
├── data/                    # Data layer
│   ├── types.ts            # TypeScript type definitions
│   ├── syntheticData.ts    # Synthetic data generation
│   └── README.md           # Data documentation
├── requirements.txt         # Python dependencies
├── SETUP.md               # This setup guide
└── README.md              # Main project documentation
```

## 🛠️ Development Tools

### Code Formatting

```bash
# Format Python code
black .
isort .

# Format TypeScript/JavaScript code
cd frontend
npm run lint
```

### Type Checking

```bash
# Python type checking
mypy .

# TypeScript type checking
cd frontend
npm run build
```

## 🔄 Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/amr_analytics

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Redis Configuration (for real-time updates)
REDIS_URL=redis://localhost:6379

# Development Settings
DEBUG=true
ENVIRONMENT=development
```

## 🧪 Testing

### Python Tests

```bash
# Run Python tests
pytest

# Run with coverage
pytest --cov=.
```

### Frontend Tests

```bash
# Run frontend tests (when implemented)
cd frontend
npm test
```

## 📦 Production Build

### Frontend Build

```bash
cd frontend
npm run build

# Built files will be in frontend/dist/
```

### Backend Build

```bash
# Install production dependencies
pip install -r requirements.txt

# Start production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🐛 Troubleshooting

### Common Issues

1. **Node.js not found**
   - Install Node.js from https://nodejs.org/
   - Verify with `node --version`

2. **Python virtual environment issues**
   - Delete `venv/` folder and recreate
   - Use `python -m venv venv --clear`

3. **Port already in use**
   - Change port in `vite.config.ts` or `uvicorn` command
   - Kill process using the port

4. **Permission errors (Windows)**
   - Run PowerShell as Administrator
   - Set execution policy: `Set-ExecutionPolicy RemoteSigned`

### Getting Help

- Check the console for error messages
- Verify all dependencies are installed
- Ensure virtual environment is activated
- Check file paths and permissions

## 🚀 Next Steps

1. **Start Development**: Run `npm run dev` in frontend directory
2. **Explore Dashboard**: Open http://localhost:5173
3. **Review Code**: Check `data/` folder for data structure
4. **Customize**: Modify components in `frontend/src/components/`

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vite Documentation](https://vitejs.dev/)
