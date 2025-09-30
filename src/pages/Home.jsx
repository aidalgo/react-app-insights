import AppInsightsDemo from '../components/AppInsightsDemo'
import './Home.css'

function Home() {
  return (
    <div className="page-container">
      <section className="hero">
        <h1>Welcome to My React App</h1>
        <p className="hero-subtitle">
          A modern web application built with React and Vite
        </p>
        <div className="hero-buttons">
          <a href="#about" className="btn btn-primary">Learn More</a>
          <a href="#contact" className="btn btn-secondary">Get In Touch</a>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>⚡ Fast</h3>
            <p>Built with Vite for lightning-fast development and optimized builds</p>
          </div>
          <div className="feature-card">
            <h3>⚛️ Modern React</h3>
            <p>Uses the latest React features including hooks and functional components</p>
          </div>
          <div className="feature-card">
            <h3>📱 Responsive</h3>
            <p>Fully responsive design that works on all devices and screen sizes</p>
          </div>
        </div>
      </section>

      <AppInsightsDemo />
    </div>
  )
}

export default Home