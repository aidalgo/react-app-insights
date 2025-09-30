# React Application Insights Sample

A comprehensive sample React application demonstrating Azure Application Insights integration with custom telemetry tracking, performance monitoring, and Azure Workbook dashboard creation.

![Application Insights Demo](https://img.shields.io/badge/Azure-Application%20Insights-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF)

## 🎯 What This Sample Demonstrates

- **Complete Application Insights Integration**: Automatic and custom telemetry tracking
- **React SPA Monitoring**: Page views, route changes, and user interactions
- **Custom Event Tracking**: Form submissions, navigation, and business events
- **Performance Monitoring**: Page load times, AJAX requests, and user experience metrics
- **Error Tracking**: JavaScript exceptions and debugging information
- **Azure Workbook Dashboard**: Custom dashboard with KQL queries and visualizations
- **Multi-Environment Support**: Development, staging, and production configurations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- **Existing Azure Application Insights resource** (required)
- Access to the Application Insights connection string

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/react-app-insights-sample.git
cd react-app-insights-sample
npm install
```

### 2. Configure Application Insights

1. **Copy Environment Configuration**:
   ```bash
   cp .env.example .env.local
   ```

2. **Get Your Connection String**:
   - Go to Azure Portal > Your Application Insights Resource > Overview
   - Copy the "Connection String"
   - Update `VITE_APPINSIGHTS_CONNECTION_STRING` in `.env.local`

### 3. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` and open Developer Tools to see telemetry in action.

## 📊 Features Demonstrated

### Automatic Telemetry
- **Page Views**: Every route change tracked
- **AJAX Requests**: HTTP calls monitored automatically  
- **JavaScript Errors**: Unhandled exceptions captured
- **Performance Metrics**: Page load and render times
- **User Sessions**: Session tracking and user context

### Custom Telemetry
- **Navigation Tracking**: Menu clicks and route changes
- **Form Analytics**: Contact form submissions and validation
- **User Actions**: Button clicks and interactions
- **Custom Metrics**: Application-specific measurements
- **Error Boundaries**: React error handling integration

### Interactive Demo Features
- **Real-time Testing**: Test buttons to trigger events
- **Console Debugging**: Detailed logging for troubleshooting
- **Connection Validation**: Built-in connectivity testing
- **Force Flush**: Manual telemetry sending

## 🔧 Application Structure

```
src/
├── services/
│   └── appInsights.js          # Main Application Insights configuration
├── components/
│   ├── AppInsightsDemo.jsx     # Interactive testing component
│   ├── ContactForm.jsx         # Form with telemetry integration
│   └── Menu.jsx               # Navigation with click tracking
├── pages/
│   ├── Home.jsx               # Landing page with examples
│   ├── About.jsx              # About page
│   └── Contact.jsx            # Contact page with form
└── App.jsx                    # Main app with routing
```

## 🎛️ Environment Configuration

The application supports multiple environments with different telemetry configurations:

| Environment | Sampling | Debugging | Use Case |
|-------------|----------|-----------|----------|
| Development | 100% | Enabled | Local development |
| Staging | 50% | Limited | Testing |
| Production | 10% | Disabled | Live application |

### Environment Files

- `.env.example` - Template with placeholder values
- `.env.local.example` - Local development template
- `.env.local` - Your local configuration (not committed)
- `.env.development` - Development environment
- `.env.staging` - Staging environment  
- `.env.production` - Production environment

## 📈 Azure Workbook Dashboard

The sample includes a complete Azure Workbook template with:

### Deployment

**Prerequisites**: You need an existing Application Insights resource.

```bash
./azure/deploy-workbook.sh -g <your-resource-group> -a <your-app-insights-name>
```

Or manually:
```bash
cd azure
az deployment group create \
  --resource-group <your-resource-group> \
  --template-file workbook-template.json \
  --parameters @workbook-parameters.json \
  --parameters workbookDisplayName="React App Insights Dashboard" \
  --parameters workbookSourceId="/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/microsoft.insights/components/{app-insights-name}"
```

### Dashboard Sections

1. **Navigation Analytics**
   - Menu click patterns
   - Route transition flows
   - Popular pages and sections

2. **Contact Form Analytics**
   - Submission success/failure rates
   - Validation error patterns
   - Form completion funnels

3. **Performance Monitoring**
   - Page load time distributions
   - Browser performance breakdown
   - Network timing analysis

4. **Error Monitoring**
   - Exception rates and types
   - JavaScript error patterns
   - Browser compatibility issues

5. **User Behavior**
   - Session duration analysis
   - User engagement metrics
   - Geographic usage patterns

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:staging` - Start with staging environment
- `npm run build` - Build for production
- `npm run build:staging` - Build for staging
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding Custom Telemetry

```javascript
import { trackEvent, trackMetric, trackException } from './services/appInsights'

// Track custom events
trackEvent('UserAction', { 
  action: 'button_click', 
  component: 'MyComponent' 
})

// Track performance metrics
trackMetric('ApiResponseTime', 245, { 
  endpoint: '/api/users' 
})

// Track exceptions
try {
  riskyOperation()
} catch (error) {
  trackException(error, { context: 'user_action' })
}
```

## 🔍 Troubleshooting

### Common Issues

1. **No data in Application Insights**
   - Check connection string format
   - Verify network requests in browser DevTools
   - Wait 2-5 minutes for data propagation
   - Use "Live Metrics" for real-time monitoring

2. **Console errors**
   - Check browser ad blockers
   - Verify CORS settings
   - Check Application Insights resource status

3. **Environment configuration**
   - Ensure `.env.local` exists and is configured
   - Restart development server after env changes
   - Check Vite environment variable prefix (`VITE_`)

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed debugging steps.

## 📚 Additional Resources

- [Application Insights JavaScript SDK](https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript)
- [React Plugin Documentation](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
- [Azure Workbooks Documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-overview)
- [KQL Query Language](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## ⭐ What's Next?

- Integrate with Azure Functions for backend telemetry
- Add custom user authentication tracking
- Implement A/B testing with Application Insights
- Create alerting rules for production monitoring
- Add automated deployment with GitHub Actions

---