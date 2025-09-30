import ContactForm from '../components/ContactForm'
import './Contact.css'

function Contact() {
  return (
    <div className="page-container">
      <section className="contact-header">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">
          Have a question or want to work with us? We'd love to hear from you.
        </p>
      </section>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>hello@myapp.com</p>
            </div>
            
            <div className="info-item">
              <div className="info-icon">📱</div>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            
            <div className="info-item">
              <div className="info-icon">📍</div>
              <h3>Address</h3>
              <p>123 Tech Street<br />Silicon Valley, CA 94000</p>
            </div>
            
            <div className="info-item">
              <div className="info-icon">⏰</div>
              <h3>Hours</h3>
              <p>Mon - Fri: 9AM - 6PM<br />Weekend: By appointment</p>
            </div>
          </div>
        </div>
        
        <ContactForm />
      </div>
    </div>
  )
}

export default Contact