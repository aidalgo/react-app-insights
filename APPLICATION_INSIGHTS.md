# Azure Application Insights Integration

This React application has been configured with Azure Application Insights for comprehensive telemetry and monitoring.

## 🔧 Configuration

### Connection String
The Application Insights connection string is configured in the `.env` file:
```
VITE_APPINSIGHTS_CONNECTION_STRING=InstrumentationKey=...
```

### Service Module
The main configuration is in `src/services/appInsights.js` which includes:
- ApplicationInsights SDK initialization
- React plugin for SPA tracking
- Custom telemetry functions
- Telemetry initializers

## 📊 What's Being Tracked

### Automatic Tracking
- **Page Views**: Automatically tracked for all routes
- **Route Changes**: React Router navigation is monitored
- **AJAX/Fetch Requests**: HTTP requests are tracked
- **JavaScript Errors**: Unhandled exceptions are captured
- **Performance Metrics**: Page load times and performance data

### Custom Tracking
- **Navigation Events**: Menu clicks and route changes
- **Form Interactions**: Contact form submissions, validation errors
- **User Actions**: Button clicks and user interactions
- **Custom Metrics**: Application-specific measurements
- **Custom Events**: Business logic events

## 🎯 Available Functions

### Event Tracking
```javascript
import { trackEvent } from '../services/appInsights'

trackEvent('UserAction', {
  action: 'button_click',
  component: 'ContactForm'
})
```

### Exception Tracking
```javascript
import { trackException } from '../services/appInsights'

try {
  // risky operation
} catch (error) {
  trackException(error, { context: 'form_submission' })
}
```

### Metric Tracking
```javascript
import { trackMetric } from '../services/appInsights'

trackMetric('ResponseTime', 150, { endpoint: '/api/contact' })
```

### Page View Tracking
```javascript
import { trackPageView } from '../services/appInsights'

trackPageView('Custom Page', '/custom-url', { feature: 'demo' })
```

### Trace Logging
```javascript
import { trackTrace } from '../services/appInsights'

trackTrace('User performed action', 1, { userId: '123' })
```

## 🔍 Viewing Data

1. Go to your Azure Application Insights resource in the Azure Portal
2. Navigate to **Investigate** > **Transaction search** for real-time events
3. Use **Investigate** > **Application map** to see dependencies
4. Check **Investigate** > **Performance** for performance insights
5. Use **Monitoring** > **Logs** for custom KQL queries

## 📈 Example KQL Queries

### Custom Events
```kql
customEvents
| where name == "Navigation_MenuClick"
| summarize count() by tostring(customDimensions.menuItem)
```

### Form Submissions
```kql
customEvents
| where name == "ContactForm_SubmissionSuccess"
| summarize count() by bin(timestamp, 1h)
```

### Page Views by Route
```kql
pageViews
| summarize count() by name
| order by count_ desc
```

## 🛡️ Privacy & Security

- Connection strings are not considered secrets but should be protected
- Consider using separate Application Insights resources for different environments
- User context and session data are automatically handled by the SDK
- No sensitive form data is tracked in the current implementation

## 🚀 Production Considerations

1. **Sampling**: Consider reducing `samplingPercentage` in production
2. **Performance**: Monitor the performance impact of telemetry
3. **Storage**: Review data retention policies
4. **Alerting**: Set up alerts for errors and performance issues
5. **Dashboard**: Create custom dashboards for business metrics

## 🔄 Environment Configuration

### Development
- Full telemetry enabled
- 100% sampling rate
- Console logging enabled

### Production (Recommended)
- Reduce sampling to 10-20%
- Disable console logging
- Enable performance optimizations
- Set up proper alerting

## 📚 Resources

- [Application Insights JavaScript SDK Documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript)
- [React Plugin Documentation](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
- [KQL Query Language Reference](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/)