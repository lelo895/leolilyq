import React, { useState, useEffect } from 'react';
import { MEDIA_BASE } from '../config.js';

export default function Notebook() {
  const [isMobile, setIsMobile] = useState(false);
  const [isStickyOpen, setIsStickyOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraFlashing, setIsCameraFlashing] = useState(false);

  const handleCameraClick = (e) => {
    e.stopPropagation();
    setIsCameraFlashing(true);
    if (window.audioEngine) {
      window.audioEngine.play('capture');
    }
    setTimeout(() => {
      setIsCameraFlashing(false);
    }, 400);
  };

  useEffect(() => {
    let rafId = null;

    const handleResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        // Mobile check
        const mobile = window.innerWidth <= 1024 || (window.innerWidth <= 1366 && window.matchMedia('(hover: none)').matches);
        setIsMobile(mobile);

        // Scale calculation
        const targetW = 1350;
        const targetH = 640;
        const padX = 40;
        const padY = 90;

        const availableW = Math.max(320, window.innerWidth - padX);
        const availableH = Math.max(320, window.innerHeight - padY);

        const scaleX = availableW / targetW;
        const scaleY = availableH / targetH;

        const scale = Math.min(1.0, Math.min(scaleX, scaleY));
        document.documentElement.style.setProperty('--notebook-scale', scale.toFixed(3));
        rafId = null;
      });
    };

    handleResize(); // Initial compute
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Escape key handler for sticky modal
  useEffect(() => {
    if (!isStickyOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsStickyOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStickyOpen]);

  const renderMobileAbout = () => (
    <div id="mobile-about-wrapper" className="page-content-wrapper about-view">
      <aside className="about-sidebar">
        {/* Profile Card */}
        <div className="profile-card">
          <img src={`${MEDIA_BASE}/profile.webp`} alt="Yongqian (Leo) Li Profile Photo" className="profile-img" width="300" height="300" loading="lazy" />
          <h1 className="profile-name">YONGQIAN (LEO) LI <span lang="zh">李泳谦</span></h1>
          <p className="profile-tagline">Film & Media Major @ UC Irvine</p>
        </div>

        {/* Bio */}
        <div className="profile-section">
          <p className="profile-bio">
            "I specialize in filmmaking, photography, and video editing, driven by a deep passion for visual storytelling. My goal is to capture the essence of culture, nature, and hidden gems to inspire those who see my work."
          </p>
        </div>

        <div className="about-main-content">
          {/* Education */}
          <section className="resume-section">
            <h2 className="section-title">Education</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-header">
                  <h3 className="timeline-school">University of California, Irvine</h3>
                  <span className="timeline-date">Aug. 2025 - Present</span>
                </div>
                <p className="timeline-degree">Bachelor of Arts, Film and Media Studies</p>
                <p className="timeline-gpa">GPA: 3.8 — Irvine, CA</p>
              </div>
              <div className="timeline-item">
                <div className="timeline-header">
                  <h3 className="timeline-school">Peralta Community College District</h3>
                  <span className="timeline-date">Aug. 2022 - Jun. 2025</span>
                </div>
                <p className="timeline-degree">Associate in Arts, Arts/Social & Behavioral Sciences</p>
                <p className="timeline-degree">Associate in Arts, Arts and Humanities</p>
                <p className="timeline-gpa">GPA: 3.82 — Alameda, CA</p>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="resume-section" id="experience-section">
            <h2 className="section-title">Experience</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-header">
                  <h3 className="timeline-role">Video & Tech Intern / Incoming Director of Technology</h3>
                  <span className="timeline-date">Jan. 2026 - Present</span>
                </div>
                <p className="timeline-company">Film Arts Drama Alliance (FADA) - Film Club | Irvine, CA</p>
              </div>
              <div className="timeline-item">
                <div className="timeline-header">
                  <h3 className="timeline-role">Video Editor - YouTube Content</h3>
                  <span className="timeline-date">Sept. 2025 - Present</span>
                </div>
                <p className="timeline-company">Freelance Video Editor | Irvine, CA</p>
              </div>
              <div className="timeline-item">
                <div className="timeline-header">
                  <h3 className="timeline-role">Content Creator & Photographer</h3>
                  <span className="timeline-date">2024 - Present</span>
                </div>
                <p className="timeline-company">Personal Projects / Social Media | Alameda, CA</p>
              </div>
            </div>
          </section>
        </div>

        {/* Skills */}
        <div className="profile-section skills-info">
          <section className="resume-section">
            <h2 className="section-title" style={{ marginTop: 'var(--space-md)' }}>Skills</h2>
            <div className="mobile-skills-grid">
              <div className="paper-cutout-skill"><div className="pin pin-red"></div><img src={`${MEDIA_BASE}/tools/premierepro.svg`} alt="Premiere Pro" /><span>Premiere Pro</span></div>
              <div className="paper-cutout-skill"><div className="pin pin-blue"></div><img src={`${MEDIA_BASE}/tools/davinciresolve.svg`} alt="DaVinci Resolve" /><span>DaVinci</span></div>
              <div className="paper-cutout-skill"><div className="pin pin-yellow"></div><img src={`${MEDIA_BASE}/tools/photoshop.svg`} alt="Photoshop" /><span>Photoshop</span></div>
              <div className="paper-cutout-skill"><div className="pin pin-green"></div><img src={`${MEDIA_BASE}/tools/lightroom.svg`} alt="Lightroom" /><span>Lightroom</span></div>
              <div className="paper-cutout-skill"><div className="pin pin-red"></div><img src={`${MEDIA_BASE}/tools/capcut.svg`} alt="CapCut" /><span>CapCut</span></div>
            </div>
          </section>
        </div>

        {/* Contact Info */}
        <div className="contact-skills-row" style={{ marginTop: 'var(--space-md)' }}>
          <div className="contact-socials-col">
            <div className="profile-section contact-info">
              <h3>CONTACT</h3>
              <ul>
                <li><i className="fa-regular fa-envelope" aria-hidden="true"></i> <a href="mailto:yonli88895@gmail.com">yonli88895@gmail.com</a></li>
                <li><i className="fa-solid fa-phone" aria-hidden="true"></i> <a href="tel:+14159874813">(415) 987-4813</a></li>
                <li><i className="fa-solid fa-location-dot" aria-hidden="true"></i> Alameda, CA 94501</li>
              </ul>
            </div>
            <div className="profile-section socials-list">
              <h3>FOLLOW MY WORK</h3>
              <div className="social-icons">
                <a href="https://www.instagram.com/lelos_cam/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href="https://www.youtube.com/@lelo88895/" target="_blank" rel="noreferrer" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
                <a href="https://www.linkedin.com/in/leo-li-69781a308/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Note Pad */}
        <div className="sticky-note-section" style={{ justifyContent: 'center', marginTop: '20px' }}>
          <button type="button" className="sticky-note-trigger" onClick={() => setIsStickyOpen(true)}>
            <div className="sticky-tape"></div>
            <div className="sticky-note-header">📌 Contact Me</div>
            <p className="sticky-note-preview">Click note to leave a message…</p>
            <span className="sticky-note-corner"></span>
          </button>
        </div>
      </aside>
    </div>
  );

  const renderDesktopLeftAbout = () => (
    <div className="page-content-wrapper about-view">
      <aside className="about-sidebar">
        <div className="profile-card">
          <img src={`${MEDIA_BASE}/profile.webp`} alt="Yongqian (Leo) Li Profile Photo" className="profile-img" width="300" height="300" loading="lazy" />
          <h1 className="profile-name">YONGQIAN (LEO) LI <span lang="zh">李泳谦</span></h1>
          <p className="profile-tagline">Film & Media Major @ UC Irvine</p>
        </div>
        <div className="profile-section">
          <p className="profile-bio">
            "I specialize in filmmaking, photography, and video editing, driven by a deep passion for visual storytelling. My goal is to capture the essence of culture, nature, and hidden gems to inspire those who see my work."
          </p>
        </div>
        <div className="contact-skills-row">
          <div className="contact-socials-col">
            <div className="profile-section contact-info">
              <h3>CONTACT</h3>
              <ul>
                <li><i className="fa-regular fa-envelope"></i> <a href="mailto:yonli88895@gmail.com">yonli88895@gmail.com</a></li>
                <li><i className="fa-solid fa-phone"></i> <a href="tel:+14159874813">(415) 987-4813</a></li>
                <li><i className="fa-solid fa-location-dot"></i> Alameda, CA 94501</li>
              </ul>
            </div>
            <div className="profile-section socials-list">
              <h3>FOLLOW MY WORK</h3>
              <div className="social-icons">
                <a href="https://www.instagram.com/lelos_cam/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href="https://www.youtube.com/@lelo88895/" target="_blank" rel="noreferrer" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
                <a href="https://www.linkedin.com/in/leo-li-69781a308/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
          <div className="profile-section skills-info">
            <section className="resume-section">
              <div className="skills-grid">
                <div className="skills-block">
                  <h3>CREATIVE SUITE</h3>
                  <div className="laptop-frame">
                    <div className="laptop-screen-bezel">
                      <div className="mac-os-dock-container">
                        <div className="mac-top-bar">
                          <div className="mac-top-bar-left">
                            <i className="fa-brands fa-apple"></i><span>Finder</span><span>File</span><span>Edit</span>
                          </div>
                          <div className="mac-top-bar-right">
                            <i className="fa-solid fa-wifi"></i><i className="fa-solid fa-battery-full"></i><span className="mac-time" id="macTime">10:00 AM</span>
                          </div>
                        </div>
                        <div className="mac-screen">
                          <div className="active-app-display" id="activeAppDisplay">
                            <img src="" alt="" className="active-app-icon" id="activeAppIcon" />
                            <span className="active-app-name" id="activeAppName"></span>
                          </div>
                        </div>
                        <div className="mac-dock">
                          <div className="dock-item"><img src={`${MEDIA_BASE}/tools/premierepro.svg`} alt="Premiere Pro" /><span className="dock-tooltip">Premiere Pro</span></div>
                          <div className="dock-item"><img src={`${MEDIA_BASE}/tools/davinciresolve.svg`} alt="DaVinci Resolve" /><span className="dock-tooltip">DaVinci Resolve</span></div>
                          <div className="dock-item"><img src={`${MEDIA_BASE}/tools/photoshop.svg`} alt="Photoshop" /><span className="dock-tooltip">Photoshop</span></div>
                          <div className="dock-item"><img src={`${MEDIA_BASE}/tools/lightroom.svg`} alt="Lightroom" /><span className="dock-tooltip">Lightroom</span></div>
                          <div className="dock-item"><img src={`${MEDIA_BASE}/tools/capcut.svg`} alt="CapCut" /><span className="dock-tooltip">CapCut</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="laptop-base"><div className="laptop-notch"></div></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </aside>
    </div>
  );

  const handleStickySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('access_key', '75f41163-6a6a-4c43-98eb-796b8520e49d');
      formData.append('name', contactForm.name);
      formData.append('email', contactForm.email);
      formData.append('message', contactForm.message);
      formData.append('subject', `Portfolio Contact from ${contactForm.name}`);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      console.log('Web3Forms response:', data);
    } catch (err) {
      console.error('Email submission error:', err);
    } finally {
      setIsSubmitting(false);
      setFormSent(true);
      setTimeout(() => {
        setFormSent(false);
        setIsStickyOpen(false);
        setContactForm({ name: '', email: '', message: '' });
      }, 1800);
    }
  };

  const renderDesktopRightAbout = () => (
    <div className="page-content-wrapper about-view">
      <div className="about-main-content">
        <section className="resume-section">
          <h2 className="section-title">Education</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-school">University of California, Irvine</h3>
                <span className="timeline-date">Aug. 2025 - Present</span>
              </div>
              <p className="timeline-degree">Bachelor of Arts, Film and Media Studies</p>
              <p className="timeline-gpa">GPA: 3.8 — Irvine, CA</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-school">Peralta Community College District</h3>
                <span className="timeline-date">Aug. 2022 - Jun. 2025</span>
              </div>
              <p className="timeline-degree">Associate in Arts, Arts/Social & Behavioral Sciences</p>
              <p className="timeline-degree">Associate in Arts, Arts and Humanities</p>
              <p className="timeline-gpa">GPA: 3.82 — Alameda, CA</p>
            </div>
          </div>
        </section>
        <section className="resume-section" id="experience-section">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-role">Video & Tech Intern / Incoming Director of Technology</h3>
                <span className="timeline-date">Jan. 2026 - Present</span>
              </div>
              <p className="timeline-company">Film Arts Drama Alliance (FADA) - Film Club | Irvine, CA</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-role">Video Editor - YouTube Content</h3>
                <span className="timeline-date">Sept. 2025 - Present</span>
              </div>
              <p className="timeline-company">Freelance Video Editor | Irvine, CA</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-role">Content Creator & Photographer</h3>
                <span className="timeline-date">2024 - Present</span>
              </div>
              <p className="timeline-company">Personal Projects / Social Media | Alameda, CA</p>
            </div>
          </div>
        </section>

        {/* Sticky Note Pad & Camera Gear */}
        <div className="sticky-note-section">
          {/* Canon DSLR Camera Widget */}
          <div 
            className={`item-wrapper camera-wrapper-about ${isCameraFlashing ? 'flash-active' : ''}`}
            id="camera-trigger-about"
            role="button"
            tabIndex={0}
            aria-label="Canon EOS Rebel T7 DSLR Camera"
            onClick={handleCameraClick}
          >
            <div className="camera-body">
              <div className="camera-flash-unit">
                <div className="camera-flash-light"></div>
              </div>
              <div className="camera-top-dial"></div>
              <div className="camera-lens-mount">
                <div className="camera-lens">
                  <div className="camera-lens-inner">
                    <div className="camera-lens-glass"></div>
                  </div>
                </div>
              </div>
              <div className="camera-button"></div>
              <div className="camera-grip"></div>
              <div className="camera-brand">Canon</div>
              <div className="camera-model">EOS<br /><span>Rebel T7</span></div>
            </div>
            <div className="gear-tooltip">
              <span className="gear-title">Canon EOS Rebel T7</span>
            </div>
          </div>

          <button type="button" className="sticky-note-trigger" onClick={() => setIsStickyOpen(true)}>
            <div className="sticky-tape"></div>
            <div className="sticky-note-header">📌 Contact Me</div>
            <p className="sticky-note-preview">Click note to leave a message…</p>
            <span className="sticky-note-corner"></span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div id="canvas-container">
        <div id="notebook-container" className="notebook-container">
          <div className="notebook">
            <div className="notebook-spine">
              <div className="spine-ring ring-1"></div>
              <div className="spine-ring ring-2"></div>
              <div className="spine-ring ring-3"></div>
              <div className="spine-ring ring-4"></div>
            </div>

            <div className="notebook-page left-page">
              <div className="divider-tabs" role="tablist" aria-label="Portfolio Sections">
                <button className="divider-tab active" data-category="portfolio" role="tab" aria-selected="true">
                  <span className="tab-badge">📷</span> <span className="tab-label">Portfolio</span>
                </button>
                <button className="divider-tab" data-category="videos" role="tab" aria-selected="false">
                  <span className="tab-badge">🎬</span> <span className="tab-label">Videos</span>
                </button>
                <button className="divider-tab" data-category="about" role="tab" aria-selected="false">
                  <span className="tab-badge">🙋</span> <span className="tab-label">About Me</span>
                </button>
              </div>

              <div className="page-paper">
                <div className="page-content-wrapper portfolio-view">
                  <div className="category-header-container">
                    <button className="category-arrow cat-arrow-prev" id="cat-prev-btn" aria-label="Previous Category">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pencil-sketch-arrow">
                        <path d="M15 19l-7-7 7-7" />
                        <path d="M14.5 18.5l-6.5-6.5 6.5-6.5" opacity="0.4" strokeWidth="1.5" />
                      </svg>
                    </button>
                    <div className="category-title-slider">
                      <div className="category-title-track" id="category-title-track">
                        <h2 className="page-title cat-title-item" data-cat="nature" data-index="0">Nature</h2>
                        <h2 className="page-title cat-title-item" data-cat="people" data-index="1">People</h2>
                        <h2 className="page-title cat-title-item" data-cat="photowalk" data-index="2">Photowalk</h2>

                        <h2 className="page-title cat-title-item active" data-cat="nature" data-index="3">Nature</h2>
                        <h2 className="page-title cat-title-item" data-cat="people" data-index="4">People</h2>
                        <h2 className="page-title cat-title-item" data-cat="photowalk" data-index="5">Photowalk</h2>

                        <h2 className="page-title cat-title-item" data-cat="nature" data-index="6">Nature</h2>
                        <h2 className="page-title cat-title-item" data-cat="people" data-index="7">People</h2>
                        <h2 className="page-title cat-title-item" data-cat="photowalk" data-index="8">Photowalk</h2>
                      </div>
                    </div>
                    <button className="category-arrow cat-arrow-next" id="cat-next-btn" aria-label="Next Category">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pencil-sketch-arrow">
                        <path d="M9 5l7 7-7 7" />
                        <path d="M9.5 5.5l6.5 6.5-6.5 6.5" opacity="0.4" strokeWidth="1.5" />
                      </svg>
                    </button>
                  </div>
                  <div className="photos-slider-container">
                    <button className="slider-arrow slider-arrow-left" id="photo-slider-prev" aria-label="Previous Photo" disabled>
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <div className="photos-track-wrapper" id="photos-track-wrapper">
                      <div className="photos-grid" id="photos-grid"></div>
                    </div>
                    <button className="slider-arrow slider-arrow-right" id="photo-slider-next" aria-label="Next Photo">
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>

                {isMobile ? renderMobileAbout() : renderDesktopLeftAbout()}
              </div>
            </div>

            <div className="notebook-page right-page">
              <div className="page-paper">
                <div className="page-content-wrapper portfolio-view">
                  <h2 className="page-title">Videos & Reels</h2>
                  <div className="tickets-slider-container">
                    <button className="slider-arrow slider-arrow-left" id="ticket-slider-prev" aria-label="Previous Ticket">
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <div className="tickets-track-wrapper">
                      <div className="tickets-grid" id="tickets-grid"></div>
                    </div>
                    <button className="slider-arrow slider-arrow-right" id="ticket-slider-next" aria-label="Next Ticket">
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                    <div className="ticket-pagination-dots" id="ticket-pagination-dots"></div>
                  </div>
                </div>

                {!isMobile && renderDesktopRightAbout()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Centered Note - Top Level Portal */}
      {isStickyOpen && (
        <div className="sticky-modal-overlay" onClick={() => setIsStickyOpen(false)}>
          <div className="sticky-modal-paper" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="sticky-modal-title">
            <button type="button" className="sticky-modal-close" onClick={() => setIsStickyOpen(false)} aria-label="Close message form">✕</button>
            <div className="sticky-tape modal-tape"></div>
            <h3 className="sticky-modal-title" id="sticky-modal-title">Leave a Message 📝</h3>
            {formSent ? (
              <div className="sticky-success-msg">
                <h4>Message Sent! ✨</h4>
                <p>Thanks for reaching out!</p>
              </div>
            ) : (
              <form onSubmit={handleStickySubmit} className="sticky-form">
                <div className="sticky-form-group">
                  <label htmlFor="sticky-name">Name:</label>
                  <input
                    id="sticky-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="sticky-form-group">
                  <label htmlFor="sticky-email">Email:</label>
                  <input
                    id="sticky-email"
                    type="email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="sticky-form-group">
                  <label htmlFor="sticky-message">Message:</label>
                  <textarea
                    id="sticky-message"
                    required
                    rows="3"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Write message here…"
                  ></textarea>
                </div>
                <button type="submit" className="sticky-send-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
