# 🔍 Application Insights Troubleshooting Guide

## Quick Debugging Steps

### 1. **Open the Application**
- Go to: http://localhost:5174/
- Open Developer Tools (F12)
- Go to the **Console** tab

### 2. **Check Console Messages**
Look for these messages when the app loads:
```
🔍 Application Insights Configuration:
Environment Mode: development
Connection String Available: true
Connection String Preview: InstrumentationKey=f3d10cd0-8868-4aa7...
✅ Connection string format appears valid
🚀 Initializing Application Insights...
📄 Tracking initial page view...
✅ Application Insights initialized successfully
```

### 3. **Test Connection**
- Scroll down to the "Application Insights Debugging" section
- Click **"🔧 Test Connection"**
- Should show "✅ Connected" status

### 4. **Check Network Requests**
- Go to **Network** tab in Developer Tools
- Click any of the test buttons (Track Custom Event, etc.)
- Look for requests to domains containing:
  - `westus3-1.in.applicationinsights.azure.com`
  - `dc.applicationinsights.azure.com` 
  - `*.applicationinsights.azure.com`

### 5. **Force Send Data**
- Click **"🚀 Force Flush"** button
- This immediately sends any pending telemetry

### 6. **Check Azure Portal**
- Go to your Application Insights resource in Azure Portal
- Navigate to **"Transaction search"** or **"Live Metrics"**
- Data may take 2-5 minutes to appear

## Common Issues & Solutions

### ❌ "Connection String Not Found"
**Problem**: Environment variable not loaded
**Solution**: 
1. Restart the dev server: `npm run dev`
2. Check `.env` file exists and has correct format
3. Verify the environment variable name: `VITE_APPINSIGHTS_CONNECTION_STRING`

### ❌ No Network Requests
**Problem**: SDK not sending data
**Solutions**:
1. Check console for JavaScript errors
2. Verify connection string format
3. Try force flush
4. Check browser ad blockers (disable for localhost)

### ❌ "SDK Load Failure"
**Problem**: Application Insights SDK failed to initialize
**Solutions**:
1. Check internet connection
2. Check for browser extensions blocking scripts
3. Clear browser cache and reload

### ❌ Data Not Appearing in Azure
**Problem**: Data sent but not visible in portal
**Solutions**:
1. Wait 2-5 minutes (normal delay)
2. Check the correct Application Insights resource
3. Use "Live Metrics" for real-time data
4. Check Azure region and resource availability

## What Should You See?

### In Browser Console:
- Configuration messages
- Event tracking confirmations
- No JavaScript errors

### In Network Tab:
- POST requests to *.applicationinsights.azure.com
- Response status 200 OK
- Request payload containing telemetry data

### In Azure Portal:
- Events in Transaction Search
- Live metrics (real-time)
- Custom events in the Events section
- Page views in the Page Views section

## Test Commands

### Manual Testing in Console:
```javascript
// Test if AppInsights is available
console.log(window.appInsights)

// Send test event
appInsights.trackEvent({name: 'ManualTest', properties: {test: true}})

// Check configuration
console.log(appInsights.config)
```

## Need More Help?

1. Check the full console output for errors
2. Look at the Test Results in the debugging component
3. Verify your Azure Application Insights resource is active
4. Try the "Live Metrics" feature in Azure for real-time debugging