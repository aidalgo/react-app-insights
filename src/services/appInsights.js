import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

// Create browser history for React Router integration
const browserHistory = createBrowserHistory();

// Create React plugin instance
const reactPlugin = new ReactPlugin();

// Get environment from various sources with fallback logic
const getEnvironment = () => {
  // Check for explicit environment variable first
  if (import.meta.env.VITE_ENVIRONMENT) {
    return import.meta.env.VITE_ENVIRONMENT;
  }
  
  // Check URL parameters for environment override
  const urlParams = new URLSearchParams(window.location.search);
  const envParam = urlParams.get('env') || urlParams.get('environment');
  if (envParam) {
    return envParam;
  }
  
  // Check hostname for environment detection
  const hostname = window.location.hostname;
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  } else if (hostname.includes('staging') || hostname.includes('test')) {
    return 'staging';
  } else if (hostname.includes('prod') || hostname.includes('app.')) {
    return 'production';
  }
  
  // Fallback to Vite mode
  return import.meta.env.MODE || 'development';
};

const environment = getEnvironment();

// Your Azure Application Insights connection string
const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING || 
  'InstrumentationKey=your-instrumentation-key-here;IngestionEndpoint=https://your-region.in.applicationinsights.azure.com/;LiveEndpoint=https://your-region.livediagnostics.monitor.azure.com/;ApplicationId=your-application-id-here';

// Debug logging
console.log('🔍 Application Insights Configuration:');
console.log('Environment:', environment);
console.log('Vite Mode:', import.meta.env.MODE);
console.log('Connection String Available:', !!connectionString);
console.log('Connection String Preview:', connectionString.substring(0, 50) + '...');

// Validate connection string format
if (!connectionString || !connectionString.includes('InstrumentationKey=')) {
  console.error('❌ Invalid Application Insights connection string!');
} else {
  console.log('✅ Connection string format appears valid');
}

// Application Insights configuration
const appInsights = new ApplicationInsights({
  config: {
    connectionString: connectionString,
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: {
        history: browserHistory
      }
    },
    // Additional configuration options
    enableAutoRouteTracking: true, // Automatically track route changes
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableCorsCorrelation: true,
    enableAjaxErrorStatusText: true,
    enableAjaxPerfTracking: true,
    disableFetchTracking: false,
    disableXhr: false,
    disableExceptionTracking: false,
    disableTelemetry: false,
    // Sampling configuration (optional)
    samplingPercentage: 100, // Set to lower value in production (e.g., 10)
    // Performance configuration
    enablePerfMgr: true,
    perfEvtsSendAll: false,
    // User context
    enableUserContext: true,
    enableSessionContext: true,
    // Cookie settings
    cookieDomain: undefined,
    isCookieUseDisabled: false,
    isRetryDisabled: false,
    isStorageUseDisabled: false,
    isBrowserLinkTrackingEnabled: false,
    // Debug mode (enable in development for troubleshooting)
    loggingLevelConsole: import.meta.env.MODE === 'development' ? 2 : 0, // 0 = INFO, 1 = WARN, 2 = ERROR
    loggingLevelTelemetry: 1,
    diagnosticLogInterval: import.meta.env.MODE === 'development' ? 5000 : 10000
  }
});

// Initialize Application Insights
console.log('🚀 Initializing Application Insights...');
appInsights.loadAppInsights();

// Track initial page view
console.log('📄 Tracking initial page view...');
appInsights.trackPageView({
  name: 'App_Initialized',
  uri: window.location.href,
  properties: {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    environment: environment
  }
});

console.log('✅ Application Insights initialized successfully');

// Set up authenticated user context (optional)
export const setAuthenticatedUserContext = (authenticatedUserId, accountId = null) => {
  appInsights.setAuthenticatedUserContext(authenticatedUserId, accountId);
};

// Clear authenticated user context
export const clearAuthenticatedUserContext = () => {
  appInsights.clearAuthenticatedUserContext();
};

// Custom event tracking
export const trackEvent = (name, properties = {}, measurements = {}) => {
  try {
    console.log(`📊 Tracking Event: ${name}`, { properties, measurements });
    appInsights.trackEvent({ name, properties, measurements });
    console.log(`✅ Event tracked successfully: ${name}`);
  } catch (error) {
    console.error(`❌ Failed to track event: ${name}`, error);
  }
};

// Custom page view tracking
export const trackPageView = (name, url, properties = {}, measurements = {}) => {
  try {
    console.log(`📄 Tracking Page View: ${name}`, { url, properties, measurements });
    appInsights.trackPageView({ name, uri: url, properties, measurements });
    console.log(`✅ Page view tracked successfully: ${name}`);
  } catch (error) {
    console.error(`❌ Failed to track page view: ${name}`, error);
  }
};

// Exception tracking
export const trackException = (exception, properties = {}) => {
  try {
    console.log(`🚨 Tracking Exception:`, exception, { properties });
    appInsights.trackException({ 
      exception: exception instanceof Error ? exception : new Error(exception),
      properties 
    });
    console.log(`✅ Exception tracked successfully`);
  } catch (error) {
    console.error(`❌ Failed to track exception:`, error);
  }
};

// Dependency tracking
export const trackDependencyData = (dependency) => {
  appInsights.trackDependencyData(dependency);
};

// Metric tracking
export const trackMetric = (name, average, properties = {}) => {
  appInsights.trackMetric({ name, average, properties });
};

// Trace tracking
export const trackTrace = (message, severityLevel = 1, properties = {}) => {
  appInsights.trackTrace({ message, severityLevel, properties });
};

// Flush telemetry (useful for SPA page transitions)
export const flush = () => {
  appInsights.flush();
};

// Add telemetry initializer
export const addTelemetryInitializer = (telemetryInitializer) => {
  appInsights.addTelemetryInitializer(telemetryInitializer);
};

// Example telemetry initializer to add custom properties to all telemetry
addTelemetryInitializer((envelope) => {
  envelope.data.baseData = envelope.data.baseData || {};
  envelope.data.baseData.properties = envelope.data.baseData.properties || {};
  
  // Add custom properties to all telemetry
  envelope.data.baseData.properties.environment = environment;
  envelope.data.baseData.properties.buildVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
  envelope.data.baseData.properties.timestamp = new Date().toISOString();
  envelope.data.baseData.properties.hostname = window.location.hostname;
  envelope.data.baseData.properties.userAgent = navigator.userAgent;
});

// Export the main appInsights instance and React plugin
export { appInsights, reactPlugin, browserHistory };
export default appInsights;