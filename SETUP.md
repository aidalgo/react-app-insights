# Quick Setup Guide

## 🚀 Get Started in 3 Minutes

### 1. Prerequisites
- Node.js 18+ installed
- **Existing Azure Application Insights resource** (required)
- Access to Application Insights connection string

### 2. Clone and Install
```bash
git clone https://github.com/yourusername/react-app-insights-sample.git
cd react-app-insights-sample
npm install
```

### 3. Configure Application Insights

#### Option A: Interactive Setup (Recommended)
```bash
./setup-azure.sh --interactive
# Follow the prompts to enter your connection string
```

#### Option B: Manual Setup
```bash
cp .env.example .env.local
# Edit .env.local with your connection string from Azure Portal
```

### 4. Run the Application
```bash
npm run dev
```
Visit `http://localhost:5173` and open browser DevTools to see telemetry.

### 5. Deploy Azure Workbook (Optional)
```bash
./azure/deploy-workbook.sh -g myResourceGroup -a myAppInsights
```

## 🔍 Verify Setup

1. **Browser Console**: Should show Application Insights initialization messages
2. **Network Tab**: Look for requests to `*.applicationinsights.azure.com`
3. **Azure Portal**: Check Application Insights > Live Metrics for real-time data

## 📞 Need Help?

- See [README.md](./README.md) for comprehensive documentation
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Review [APPLICATION_INSIGHTS.md](./APPLICATION_INSIGHTS.md) for telemetry details

## 🎯 What's Included

- ✅ Complete React + Vite application
- ✅ Application Insights SDK integration
- ✅ Custom telemetry tracking examples
- ✅ Interactive testing components
- ✅ Azure Workbook dashboard
- ✅ Multi-environment configuration
- ✅ Automated setup scripts