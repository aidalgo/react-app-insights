import './About.css'

function About() {
  return (
    <div className="page-container">
      <section className="about-header">
        <h1>About Us</h1>
        <p className="about-subtitle">
          Learn more about our mission and what we do
        </p>
      </section>

      <section className="about-content">
        <div className="about-grid">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              We are passionate developers who believe in creating amazing web experiences 
              using modern technologies. Our team is dedicated to building applications 
              that are not only functional but also beautiful and user-friendly.
            </p>
            <p>
              This React application showcases our commitment to clean code, responsive 
              design, and excellent user experience. We use the latest tools and 
              frameworks to ensure our applications are fast, reliable, and maintainable.
            </p>
          </div>
          
          <div className="about-image">
            <div className="placeholder-image">
              <span>🚀</span>
              <p>Innovation & Excellence</p>
            </div>
          </div>
        </div>
      </section>

      <section className="values">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon">💡</div>
            <h3>Innovation</h3>
            <p>We constantly explore new technologies and approaches to solve problems creatively.</p>
          </div>
          
          <div className="value-item">
            <div className="value-icon">🎯</div>
            <h3>Quality</h3>
            <p>We are committed to delivering high-quality solutions that exceed expectations.</p>
          </div>
          
          <div className="value-item">
            <div className="value-icon">🤝</div>
            <h3>Collaboration</h3>
            <p>We believe in working together to achieve the best possible outcomes.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About