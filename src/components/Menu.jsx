import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { trackEvent } from '../services/appInsights'
import './Menu.css'

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const handleNavigation = (itemName, itemPath) => {
    // Track navigation events
    trackEvent('Navigation_MenuClick', {
      menuItem: itemName,
      targetPath: itemPath,
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    })
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    
    // Track mobile menu toggle
    trackEvent('Navigation_MobileMenuToggle', {
      action: isMenuOpen ? 'close' : 'open',
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    })
  }

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ]

  return (
    <nav className="menu">
      <div className="menu-container">
        <div className="menu-brand">
          <h2>My App</h2>
        </div>
        
        {/* Desktop Menu */}
        <ul className="menu-nav desktop-nav">
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              <Link 
                to={item.path} 
                className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.name, item.path)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <button 
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Mobile Menu */}
        <ul className={`menu-nav mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              <Link 
                to={item.path} 
                className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => {
                  handleNavigation(item.name, item.path)
                  setIsMenuOpen(false)
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Menu