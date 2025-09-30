import { useState } from 'react'
import { trackEvent, trackException } from '../services/appInsights'
import './ContactForm.css'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      
      // Track form validation errors
      trackEvent('ContactForm_ValidationError', {
        errorCount: Object.keys(formErrors).length,
        errorFields: Object.keys(formErrors).join(','),
        formData: {
          hasName: !!formData.name,
          hasEmail: !!formData.email,
          hasSubject: !!formData.subject,
          hasMessage: !!formData.message
        }
      })
      
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Track form submission start
      trackEvent('ContactForm_SubmissionStarted', {
        formData: {
          nameLength: formData.name.length,
          emailDomain: formData.email.split('@')[1] || 'unknown',
          subjectLength: formData.subject.length,
          messageLength: formData.message.length
        }
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData)
      
      // Track successful form submission
      trackEvent('ContactForm_SubmissionSuccess', {
        formData: {
          nameLength: formData.name.length,
          emailDomain: formData.email.split('@')[1] || 'unknown',
          subjectLength: formData.subject.length,
          messageLength: formData.message.length
        },
        submissionTime: new Date().toISOString()
      })
      
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      
      // Track form submission error
      trackException(error, {
        formAction: 'ContactForm_Submission',
        formData: {
          hasName: !!formData.name,
          hasEmail: !!formData.email,
          hasSubject: !!formData.subject,
          hasMessage: !!formData.message
        }
      })
      
      setErrors({ submit: 'There was an error submitting the form. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="contact-form-container">
        <div className="contact-form success-message">
          <h2>Thank You!</h2>
          <p>Your message has been sent successfully. We'll get back to you soon!</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              // Track when user wants to send another message
              trackEvent('ContactForm_SendAnotherMessage', {
                timestamp: new Date().toISOString()
              })
              setIsSubmitted(false)
            }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="contact-form-container">
      <div className="contact-form">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Your full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="your.email@example.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="subject">
              Subject <span className="required">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={errors.subject ? 'error' : ''}
              placeholder="What is this about?"
            />
            {errors.subject && <span className="error-message">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message">
              Message <span className="required">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? 'error' : ''}
              placeholder="Please describe your message in detail..."
              rows={6}
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactForm