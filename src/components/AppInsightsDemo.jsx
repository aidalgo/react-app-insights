import { useState } from 'react'
import { trackEvent, trackMetric, trackTrace, trackException, appInsights, setAuthenticatedUserContext } from '../services/appInsights'
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

  // Custom KPI Events
  const trackUserCreation = () => {
    try {
      trackEvent('Admin_Approve_New_User_Click_Success', {
        createdUserId: `u-${Math.floor(Math.random() * 99999)}`,
        createdUserEmail: 'new.user@corp.com',
        sunId: '100261',
        roleName: 'Maker',
        createdByUserId: 'admin-777',
        result: 'Success',
        page: 'AdminUserApproval',
        buttonLabel: 'Approve',
        sessionId: crypto.randomUUID()
      })
      addTestResult('User Creation KPI', 'success', 'Admin user approval tracked')
    } catch (error) {
      addTestResult('User Creation KPI', 'error', error.message)
    }
  }

  const trackCompanyOnboarding = () => {
    try {
      trackEvent('InternalAdmin_CompanyOnboarding_Click_OnboardCompany', {
        page: 'CompanyOnboarding',
        buttonLabel: 'Onboard Company',
        sunId: '100001', // admin SUNID
        userId: `d3b9d4${Math.random().toString(36).substring(2, 8)}`,
        branchId: '8801',
        submittedSunId: `${100200 + Math.floor(Math.random() * 100)}`, // onboarded customer SUNID
        submittedBranchId: '8801',
        sessionId: crypto.randomUUID()
      })
      addTestResult('Company Onboarding KPI', 'success', 'Company onboarding tracked')
    } catch (error) {
      addTestResult('Company Onboarding KPI', 'error', error.message)
    }
  }

  const trackLoginSuccess = () => {
    try {
      trackEvent('Auth_Login_Success', {
        sunId: `${100200 + Math.floor(Math.random() * 100)}`,
        userId: `u-${Math.floor(Math.random() * 99999)}`,
        authProvider: 'AzureAD',
        method: 'OIDC',
        mfa: 'true',
        result: 'Success',
        sessionId: crypto.randomUUID()
      })
      addTestResult('Login Success KPI', 'success', 'User login tracked')
    } catch (error) {
      addTestResult('Login Success KPI', 'error', error.message)
    }
  }

  const trackWirePayment = () => {
    try {
      const amount = (Math.random() * 5000000 + 10000).toFixed(2) // Random amount between 10K-5M
      const statuses = ['Submitted', 'Completed', 'Processing']
      const currencies = ['USD', 'EUR', 'GBP', 'CAD']
      
      trackEvent('Payments_InitiationReview_Click_Submit', {
        page: 'PaymentInitiationReview',
        controlLabel: 'Submit',
        paymentType: 'WIRE',
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        amount: amount,
        transactionStatus: statuses[Math.floor(Math.random() * statuses.length)],
        beneficiaryId: `B${Math.floor(Math.random() * 99999)}`,
        beneficiariesAdded: '1',
        beneficiariesUpdated: '0',
        beneficiariesCount: `${Math.floor(Math.random() * 50) + 1}`,
        companyId: `C-${Math.floor(Math.random() * 9999)}`,
        companyName: 'ACME Inc',
        sunId: '100001',
        userId: `f7a1c2${Math.random().toString(36).substring(2, 8)}`,
        branchId: '8801',
        sessionId: crypto.randomUUID()
      })
      addTestResult('Wire Payment KPI', 'success', `Wire payment tracked: ${amount} ${currencies[Math.floor(Math.random() * currencies.length)]}`)
    } catch (error) {
      addTestResult('Wire Payment KPI', 'error', error.message)
    }
  }

  const trackNewTimeDeposit = () => {
    try {
      const principalAmount = (Math.random() * 2000000 + 50000).toFixed(0) // Random amount 50K-2M
      const tenors = [
        { tenor: '1', type: 'MONTHS', days: '30' },
        { tenor: '3', type: 'MONTHS', days: '90' },
        { tenor: '6', type: 'MONTHS', days: '180' },
        { tenor: '12', type: 'MONTHS', days: '365' },
        { tenor: '24', type: 'MONTHS', days: '730' }
      ]
      const selectedTenor = tenors[Math.floor(Math.random() * tenors.length)]
      
      trackEvent('MANAGE_INVESTMENTS_TimeDeposit_TimeDepositReview_Click_Submit_NewTimeDepositCreatedSuccessfully', {
        page: 'NewTimeDepositReview',
        controlLabel: 'Submit',
        sunId: '100261',
        branchId: '8801',
        sessionId: crypto.randomUUID(),
        principalAmount: principalAmount,
        tenor: selectedTenor.tenor,
        tenorType: selectedTenor.type,
        tenorInDays: selectedTenor.days
      })
      addTestResult('New Time Deposit KPI', 'success', `TD created: $${principalAmount} for ${selectedTenor.tenor} ${selectedTenor.type}`)
    } catch (error) {
      addTestResult('New Time Deposit KPI', 'error', error.message)
    }
  }

  const trackRolloverTimeDeposit = () => {
    try {
      const originalAmount = (Math.random() * 5000000 + 100000).toFixed(2) // 100K-5M
      const rolloverTypes = ['Full', 'Partial']
      const interestActions = ['Reinvest', 'Payout']
      const tenors = [
        { tenor: '3', type: 'MONTHS', days: '90' },
        { tenor: '6', type: 'MONTHS', days: '180' },
        { tenor: '12', type: 'MONTHS', days: '365' },
        { tenor: '18', type: 'MONTHS', days: '547' },
        { tenor: '24', type: 'MONTHS', days: '730' }
      ]
      const selectedTenor = tenors[Math.floor(Math.random() * tenors.length)]
      const rolloverType = rolloverTypes[Math.floor(Math.random() * rolloverTypes.length)]
      
      // Generate maturity date (past date)
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30))
      
      trackEvent('MANAGE_INVESTMENTS_TimeDeposit_TimeDepositReview_Click_Submit_RolloverCreatedSuccessfully', {
        page: 'TimeDepositReview',
        controlLabel: 'Submit',
        sunId: '100261',
        userId: `u-${Math.floor(Math.random() * 99999)}`,
        branchId: '8801',
        sessionId: crypto.randomUUID(),
        rolloverType: rolloverType,
        sourceTdId: `TD-2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
        originalMaturityDate: pastDate.toISOString().split('T')[0],
        originalPrincipalAmount: originalAmount,
        principalAmount: rolloverType === 'Full' ? originalAmount : (parseFloat(originalAmount) * 0.8).toFixed(2),
        interestAction: interestActions[Math.floor(Math.random() * interestActions.length)],
        tenor: selectedTenor.tenor,
        tenorType: selectedTenor.type,
        tenorInDays: selectedTenor.days
      })
      addTestResult('Rollover Time Deposit KPI', 'success', `TD rollover: ${rolloverType} $${originalAmount} for ${selectedTenor.tenor} ${selectedTenor.type}`)
    } catch (error) {
      addTestResult('Rollover Time Deposit KPI', 'error', error.message)
    }
  }

  const simulateUserLogin = () => {
    try {
      // Generate random user data
      const sunId = `${100200 + Math.floor(Math.random() * 100)}`
      const accountId = `ACC-${Math.floor(Math.random() * 99999)}`
      const userId = `u-${Math.floor(Math.random() * 99999)}`
      const sessionId = crypto.randomUUID()
      
      // Set authenticated user context in Application Insights
      setAuthenticatedUserContext(sunId, accountId, true)
      
      // Track the login event with full details
      trackEvent('User_Login_Authenticated', {
        sunId: sunId,
        accountId: accountId,
        userId: userId,
        authProvider: 'AzureAD',
        method: 'OIDC',
        mfa: 'true',
        result: 'Success',
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ipAddress: 'simulated',
        loginDuration: `${Math.floor(Math.random() * 3000)}ms`
      })
      
      addTestResult('User Login (Authenticated)', 'success', `User authenticated: SUNID=${sunId}, AccountId=${accountId}`)
    } catch (error) {
      addTestResult('User Login (Authenticated)', 'error', error.message)
    }
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

      <div className="kpi-section">
        <h4>📊 Custom KPI Events</h4>
        <p>Test your business metrics tracking:</p>
        <div className="demo-buttons kpi-buttons">
          <button onClick={trackUserCreation} className="demo-btn kpi-btn user-btn">
            👤 Track User Creation
          </button>
          
          <button onClick={trackCompanyOnboarding} className="demo-btn kpi-btn company-btn">
            🏢 Track Company Onboarding
          </button>
          
          <button onClick={trackLoginSuccess} className="demo-btn kpi-btn login-btn">
            🔐 Track Login Success
          </button>
          
          <button onClick={simulateUserLogin} className="demo-btn kpi-btn auth-login-btn">
            🔑 Simulate User Login (Auth Context)
          </button>
          
          <button onClick={trackWirePayment} className="demo-btn kpi-btn wire-btn">
            💸 Track Wire Payment
          </button>
          
          <button onClick={trackNewTimeDeposit} className="demo-btn kpi-btn td-new-btn">
            🏦 Track New Time Deposit
          </button>
          
          <button onClick={trackRolloverTimeDeposit} className="demo-btn kpi-btn td-rollover-btn">
            🔄 Track TD Rollover
          </button>
        </div>
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