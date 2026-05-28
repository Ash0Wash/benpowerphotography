'use client';
import { useState } from 'react';
import ProtectedImage from '../components/ProtectedImage';

export default function Contact() {
  const [formStatus, setFormStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('https://formsubmit.co/ajax/contact@benpowerphotography.com', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      
      if (response.ok) {
        setFormStatus('success');
        e.target.reset();
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="container">
      <div className="contact-grid" style={{ paddingTop: '2rem' }}>
        <div>
          <div className="section-header" style={{ padding: '0 0 2rem 0' }}>
            <h1 style={{ margin: 0 }}>Get In Touch</h1>
          </div>
          
          <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', maxWidth: '85%' }}>
            <ProtectedImage 
              src="/images/misc/contact-field.jpg" 
              alt="Contact" 
              width={0} height={0} sizes="100vw" unoptimized
              imgStyle={{ width: '100%', height: 'auto', display: 'block' }}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
        
        <div style={{ transform: 'scale(1.15)', transformOrigin: 'top left', width: '86.95%' }}>
          <div className="contact-info" style={{ marginBottom: '2rem' }}>
            <h2>Let's Work Together</h2>
            <p>For inquiries about photography, collaborations, or print purchases, please reach out via email:</p>
            <p><a href="mailto:contact@benpowerphotography.com" className="contact-link">contact@benpowerphotography.com</a></p>
            <p style={{ marginTop: '1.5rem' }}>Follow my work on <a href="https://instagram.com/benpowerphoto" target="_blank" rel="noopener noreferrer" className="contact-link">Instagram</a> to see what I am up to and behind-the-scenes content.</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" style={{ display: 'none' }} />
            
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required rows={5}></textarea>
            </div>
            
            <button type="submit" className="form-submit" disabled={formStatus === 'submitting'}>
              {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
            
            {formStatus === 'success' && (
              <div className="form-success">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            {formStatus === 'error' && (
              <div className="form-success" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
                Oops! Something went wrong. Please try emailing directly.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
