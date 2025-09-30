import { useState } from 'react'
import { trackEvent, trackMetric, trackTrace, trackException, appInsights } from '../services/appInsights'
import './AppInsightsDemo.css'

function AppInsightsDemo() {
  const [testResults, setTestResults] = useState([])
  const [isConnected, setIsConnected] = useState(null)

  const addTestResult = (test, status, details) => {
    const result = {
      test,
      status,
      details,
      timestamp: new Date().toLocaleTimeString()
    }
    setTestResults(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 results
  }

  const testConnection = async () => {
    try {
      // Check if appInsights is properly initialized
      console.log('🔍 Testing Application Insights connection...')
      
      if (!appInsights) {
        addTestResult('Connection Test', 'error', 'AppInsights not initialized')
        setIsConnected(false)
        return
      }

      // Get the instrumentation key from config
      const config = appInsights.config
      console.log('Configuration:', config)
      
      if (config && config.connectionString) {
        addTestResult('Connection Test', 'success', `Connection string configured: ${config.connectionString.substring(0, 50)}...`)
        setIsConnected(true)
      } else {
        addTestResult('Connection Test', 'error', 'No connection string found')
        setIsConnected(false)
      }

      // Send a test event immediately
      trackEvent('AppInsights_ConnectionTest', {
        testId: Math.random().toString(36),
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent,
        url: window.location.href
      })
      
      addTestResult('Test Event', 'success', 'Test event sent successfully')

    } catch (error) {
      console.error('Connection test failed:', error)
      addTestResult('Connection Test', 'error', error.message)
      setIsConnected(false)
    }
  }

  const handleTrackEvent = () => {
    try {
      const eventData = {
        buttonType: 'demo',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        randomId: Math.random().toString(36)
      }
      
      trackEvent('CustomEvent_DemoButtonClick', eventData)
      addTestResult('Custom Event', 'success', 'Demo button click tracked')
    } catch (error) {
      addTestResult('Custom Event', 'error', error.message)
    }
  }

  const handleTrackMetric = () => {
    try {
      const responseTime = Math.random() * 1000 // Simulate response time
      trackMetric('Demo_ResponseTime', responseTime, {
        page: 'home',
        timestamp: new Date().toISOString()
      })
      addTestResult('Metric', 'success', `Response time: ${responseTime.toFixed(2)}ms`)
    } catch (error) {
      addTestResult('Metric', 'error', error.message)
    }
  }

  const handleTrackTrace = () => {
    try {
      trackTrace('Demo trace message - user interacted with demo component', 1, {
        component: 'AppInsightsDemo',
        action: 'trackTrace',
        timestamp: new Date().toISOString()
      })
      addTestResult('Trace', 'success', 'Trace message sent')
    } catch (error) {
      addTestResult('Trace', 'error', error.message)
    }
  }

  const handleError = () => {
    try {
      // Send a specific alert-triggerable event BEFORE generating the error
      trackEvent('CriticalError_ButtonClicked', {
        component: 'AppInsightsDemo',
        action: 'generateError',
        severity: 'high',
        alertType: 'demo_error_button',
        environment: import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || 'development',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })
      
      // Simulate an error
      const error = new Error('This is a demo error for Application Insights testing')
      
      trackException(error, {
        component: 'AppInsightsDemo',
        action: 'generateError',
        environment: import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || 'development',
        timestamp: new Date().toISOString()
      })
      
      addTestResult('Exception', 'success', 'Demo error tracked')
      
      // Also throw it to trigger automatic error tracking
      throw error
    } catch (error) {
      console.error('Demo error:', error)
      // This will be automatically tracked by Application Insights
    }
  }

  const forceFlush = () => {
    try {
      appInsights.flush()
      addTestResult('Flush', 'success', 'Telemetry flushed to server')
    } catch (error) {
      addTestResult('Flush', 'error', error.message)
    }
  }

  const checkNetworkRequests = () => {
    addTestResult('Network Check', 'info', 'Check DevTools Network tab for requests to *.in.applicationinsights.azure.com')
  }

  return (
    <div className="appinsights-demo">
      <h3>🔍 Application Insights Debugging</h3>
      
      <div className="connection-status">
        <button onClick={testConnection} className="demo-btn test-btn">
          🔧 Test Connection
        </button>
        {isConnected !== null && (
          <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '✅ Connected' : '❌ Not Connected'}
          </div>
        )}
      </div>
      
      <p>Click these buttons to test different types of telemetry:</p>
      
      <div className="demo-buttons">
        <button onClick={handleTrackEvent} className="demo-btn event-btn">
          📊 Track Custom Event
        </button>
        
        <button onClick={handleTrackMetric} className="demo-btn metric-btn">
          📈 Track Metric
        </button>
        
        <button onClick={handleTrackTrace} className="demo-btn trace-btn">
          📝 Track Trace
        </button>
        
        <button onClick={handleError} className="demo-btn error-btn">
          🚨 Generate Error
        </button>

        <button onClick={forceFlush} className="demo-btn flush-btn">
          🚀 Force Flush
        </button>

        <button onClick={checkNetworkRequests} className="demo-btn network-btn">
          🌐 Check Network
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="test-results">
          <h4>📋 Test Results (Latest 10)</h4>
          <div className="results-list">
            {testResults.map((result, index) => (
              <div key={index} className={`result-item ${result.status}`}>
                <span className="result-time">{result.timestamp}</span>
                <span className="result-test">{result.test}</span>
                <span className="result-status">{result.status.toUpperCase()}</span>
                <span className="result-details">{result.details}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="demo-info">
        <p><strong>🔍 Troubleshooting Steps:</strong></p>
        <ol>
          <li><strong>Test Connection</strong> - Verify configuration</li>
          <li><strong>Check Console</strong> - Look for debug messages</li>
          <li><strong>Check Network Tab</strong> - Look for requests to *.applicationinsights.azure.com</li>
          <li><strong>Force Flush</strong> - Send pending telemetry immediately</li>
          <li><strong>Wait 2-5 minutes</strong> - Data may take time to appear in Azure</li>
        </ol>
        
        <p><strong>📊 What's being tracked:</strong></p>
        <ul>
          <li>Page views (automatic)</li>
          <li>Navigation events</li>
          <li>Form interactions</li>
          <li>Custom events and metrics</li>
          <li>Errors and exceptions</li>
          <li>Performance data</li>
        </ul>
      </div>
    </div>
  )
}

export default AppInsightsDemo