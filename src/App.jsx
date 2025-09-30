import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import { reactPlugin } from './services/appInsights'
import Menu from './components/Menu'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <Router>
        <div className="app">
          <Menu />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppInsightsContext.Provider>
  )
}

export default App
