'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedImage from '../components/ProtectedImage';

function BookingFormInner() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service');

  const defaultShootType =
    serviceParam === 'tour-stop' ? 'Concert Tour Stop' :
    serviceParam === 'press-epk' ? 'Band Press & EPK Portrait' :
    serviceParam === 'portrait' ? 'Creative Portrait Session' :
    serviceParam === 'festival-retainer' ? 'Festival & Tour Retainer' :
    'Concert Tour Stop';

  const defaultBudget =
    serviceParam === 'festival-retainer' ? '$1,000 - $2,500' : '$500 - $1,000';

  const [formStatus, setFormStatus] = useState('idle');
  const [selectedShootType, setSelectedShootType] = useState(defaultShootType);
  const [selectedBudget, setSelectedBudget] = useState(defaultBudget);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data['Shoot Type'] = selectedShootType;
    data['Estimated Budget Tier'] = selectedBudget;
    data['_subject'] = `New Inquiry: ${data['Artist / Project Name'] || data.name} (${selectedShootType})`;

    try {
      const response = await fetch('https://formsubmit.co/ajax/contact@benpowerphotography.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
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
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div className="section-header" style={{ paddingBottom: '1rem' }}>
        <p className="hero-subtitle" style={{ marginBottom: '0.5rem' }}>Direct Inquiries</p>
        <h1 style={{ marginBottom: '0.75rem' }}>Book a Shoot or Tour Stop</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '1.02rem', lineHeight: '1.6' }}>
          Drop your show date, venue, and project details below. I usually respond within a few hours to confirm routing and credentials.
        </p>
      </div>

      <div className="booking-form-wrap">
        {/* Left Column: Authentic Note & Contact Info */}
        <div className="booking-sidebar">
          <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
            <ProtectedImage
              src="/images/misc/contact-field.jpg"
              alt="Ben Power Photography Southern California"
              width={0}
              height={0}
              sizes="100vw"
              unoptimized
              imgStyle={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <div className="editorial-sidebar-note">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Tour &amp; Session Notes</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              For live dates, 10 edited hero selects land in your management inbox by 8:00 AM the morning after your show so your team can post recap reels while the room is still talking about it.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Every frame is individually hand-edited from scratch. Full commercial promotional rights are included on all delivered galleries.
            </p>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Direct email:</p>
              <a href="mailto:contact@benpowerphotography.com" className="contact-link" style={{ fontSize: '0.95rem' }}>
                contact@benpowerphotography.com
              </a>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                Instagram: <a href="https://instagram.com/benpowerphoto" target="_blank" rel="noopener noreferrer" className="contact-link">@benpowerphoto</a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Booking Form */}
        <div>
          <form className="contact-form" onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', padding: '2.5rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" style={{ display: 'none' }} />

            {/* Row 1: Name + Email */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input type="text" id="name" name="name" placeholder="First & Last Name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" placeholder="name@domain.com" required />
              </div>
            </div>

            {/* Row 2: Artist/Project Name + Shoot Type */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="artistName">Artist / Band / Project *</label>
                <input type="text" id="artistName" name="Artist / Project Name" placeholder="e.g. Band Name" required />
              </div>
              <div className="form-group">
                <label htmlFor="shootType">Type of Shoot *</label>
                <select
                  id="shootType"
                  className="booking-select"
                  value={selectedShootType}
                  onChange={(e) => setSelectedShootType(e.target.value)}
                  required
                >
                  <option value="Concert Tour Stop">Concert Tour Stop ($650 – $900)</option>
                  <option value="Band Press & EPK Portrait">Band Press & EPK Portraits ($750 – $1,200)</option>
                  <option value="Creative Portrait Session">Creative Portrait Session ($450 – $650)</option>
                  <option value="Festival & Tour Retainer">Festival & Tour Retainer (Custom Quote)</option>
                  <option value="Commercial / Event Shoot">Commercial / Event Shoot</option>
                  <option value="Other Project Inquiry">Other Project Inquiry</option>
                </select>
              </div>
            </div>

            {/* Row 3: Target Date + City / Venue */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="shootDate">Target Date(s) *</label>
                <input type="text" id="shootDate" name="Target Date(s)" placeholder="e.g. Nov 14 or Spring Tour" required />
              </div>
              <div className="form-group">
                <label htmlFor="venueLocation">City &amp; Venue *</label>
                <input type="text" id="venueLocation" name="City / Venue" placeholder="e.g. The Wiltern, Los Angeles" required />
              </div>
            </div>

            {/* Row 4: Budget Tier */}
            <div className="form-group">
              <label>Estimated Budget Tier</label>
              <div className="budget-tiers-container">
                <label className={`budget-tier-label ${selectedBudget === '$500 - $1,000' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="budget_tier_radio"
                    value="$500 - $1,000"
                    checked={selectedBudget === '$500 - $1,000'}
                    onChange={() => setSelectedBudget('$500 - $1,000')}
                  />
                  <span className="budget-tier-amount">$500 – $1k</span>
                  <span className="budget-tier-desc">Tour Stop / Portrait</span>
                </label>

                <label className={`budget-tier-label ${selectedBudget === '$1,000 - $2,500' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="budget_tier_radio"
                    value="$1,000 - $2,500"
                    checked={selectedBudget === '$1,000 - $2,500'}
                    onChange={() => setSelectedBudget('$1,000 - $2,500')}
                  />
                  <span className="budget-tier-amount">$1k – $2.5k</span>
                  <span className="budget-tier-desc">Press EPK / Multi-Show</span>
                </label>

                <label className={`budget-tier-label ${selectedBudget === '$2,500+' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="budget_tier_radio"
                    value="$2,500+"
                    checked={selectedBudget === '$2,500+'}
                    onChange={() => setSelectedBudget('$2,500+')}
                  />
                  <span className="budget-tier-amount">$2.5k+</span>
                  <span className="budget-tier-desc">Festival / Tour Run</span>
                </label>
              </div>
            </div>

            {/* Row 5: Project Details */}
            <div className="form-group">
              <label htmlFor="message">Project Details *</label>
              <textarea
                id="message"
                name="Project Details"
                required
                rows={5}
                placeholder="Share tour dates, set times, photo pit credential details, or what visual style you're going for..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="hero-cta"
              disabled={formStatus === 'submitting'}
              style={{ background: 'var(--accent)', color: 'var(--bg-primary)', width: '100%', justifyContent: 'center', margin: '0.5rem 0 0', cursor: formStatus === 'submitting' ? 'wait' : 'pointer' }}
            >
              {formStatus === 'submitting' ? (
                'Sending Inquiry...'
              ) : (
                <>
                  Send Booking Inquiry
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            {formStatus === 'success' && (
              <div className="form-success" style={{ marginTop: '1.25rem' }}>
                ✓ Inquiry received! Thanks for reaching out. I&apos;ll check tour routing and get back to you shortly.
              </div>
            )}

            {formStatus === 'error' && (
              <div className="form-success" style={{ marginTop: '1.25rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
                Oops, there was an issue sending. Please email directly to <a href="mailto:contact@benpowerphotography.com" style={{ textDecoration: 'underline', color: 'inherit' }}>contact@benpowerphotography.com</a>.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading form...</div>}>
      <BookingFormInner />
    </Suspense>
  );
}
