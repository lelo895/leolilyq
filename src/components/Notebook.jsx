import React, { useState, useEffect } from 'react';

export default function Notebook() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Matches our mobile and tablet definitions
      const mobile = window.innerWidth <= 1024 || (window.innerWidth <= 1366 && window.matchMedia('(hover: none)').matches);
      setIsMobile(mobile);
    };
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Foolproof CSS injector for mobile about page height
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-mobile-about-fix';
    document.head.appendChild(styleEl);

    const updateStyles = () => {
      const tab = document.body.getAttribute('data-mobile-tab');
      // Apply if tab is about AND screen is mobile/tablet size
      if (tab === 'about' && window.innerWidth <= 1366) {
        styleEl.innerHTML = `
          /* Unlock entire clipping chain: body → canvas-container → notebook */
          body {
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
          }
          #canvas-container {
            height: auto !important;
            min-height: 100vh !important;
            overflow: visible !important;
            position: relative !important;
          }
          #notebook-container, 
          #notebook-container .notebook, 
          #notebook-container .notebook-page, 
          #notebook-container .page-paper {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          #notebook-container {
            width: 100% !important;
            max-width: 100% !important;
          }
          #notebook-container .page-paper {
            display: flex !important;
            flex-direction: column !important;
            padding-bottom: 80px !important;
          }
          #mobile-about-wrapper {
            height: auto !important;
            overflow: visible !important;
          }
        `;
      } else {
        styleEl.innerHTML = '';
      }
    };

    // Run initially
    updateStyles();

    // Observe body for data-mobile-tab changes
    const observer = new MutationObserver(updateStyles);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-mobile-tab'] });

    // Also listen for resize
    window.addEventListener('resize', updateStyles);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateStyles);
      if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  const renderMobileAbout = () => (
    <div id="mobile-about-wrapper" className="page-content-wrapper about-view">
      <style>{`
        /* Scoped Mobile CSS */
        .mobile-skills-grid {
          display: flex; flex-wrap: wrap; gap: var(--space-md); margin-top: var(--space-md); justify-content: center;
        }
        .paper-cutout-skill {
          background-color: #fdfbf7; border: 1px solid rgba(0,0,0,0.1); padding: var(--space-sm) var(--space-md);
          display: flex; flex-direction: column; align-items: center; gap: var(--space-xs);
          box-shadow: 2px 3px 6px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.02);
          position: relative; pointer-events: none; border-radius: 2px;
        }
        body.dark-mode .paper-cutout-skill {
          background-color: var(--paper-bg); border-color: var(--card-border);
          box-shadow: 2px 3px 6px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.02);
        }
        .paper-cutout-skill:nth-child(even) { transform: rotate(2deg); }
        .paper-cutout-skill:nth-child(odd) { transform: rotate(-3deg); }
        .paper-cutout-skill:nth-child(3n) { transform: rotate(1deg); }
        .paper-cutout-skill img { width: 36px; height: 36px; object-fit: contain; }
        .paper-cutout-skill span { font-size: 0.75rem; font-family: var(--font-sans); color: var(--ink-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        /* Pins */
        .pin {
          width: 10px; height: 10px; border-radius: 50%; position: absolute; top: -5px; left: 50%;
          transform: translateX(-50%); box-shadow: 0 2px 4px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(0,0,0,0.2), inset 1px 1px 3px rgba(255,255,255,0.6); z-index: 2;
        }
        .pin-red { background: radial-gradient(circle at 30% 30%, #ff5e5e, #c70000); }
        .pin-blue { background: radial-gradient(circle at 30% 30%, #5ec3ff, #006ec7); }
        .pin-yellow { background: radial-gradient(circle at 30% 30%, #ffda5e, #c79c00); }
        .pin-green { background: radial-gradient(circle at 30% 30%, #5eff8e, #00c735); }
        
        /* Force visibility on mobile timelines */
        .about-view .resume-section, .about-view .timeline, .about-view .timeline-item {
          opacity: 1 !important; visibility: visible !important; display: block !important; height: auto !important;
        }
        
      `}</style>


      <aside className="about-sidebar">
        {/* Profile Card */}
        <div className="profile-card">
          <img src="/images/profile.jpg" alt="Yongqian (Leo) Li Profile Photo" className="profile-img" loading="lazy" />
          <h1 className="profile-name">YONGQIAN (LEO) LI 李泳谦</h1>
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
              <div className="paper-cutout-skill"><div className="pin pin-red"></div><img src="/images/tools/premierepro.svg" alt="Premiere Pro" /><span>Premiere Pro</span></div>
              <div className="paper-cutout-skill"><div className="pin pin-blue"></div><img src="/images/tools/davinciresolve.svg" alt="DaVinci Resolve" /><span>DaVinci</span></div>
              <div className="paper-cutout-skill"><div className="pin pin-yellow"></div><img src="/images/tools/photoshop.svg" alt="Photoshop" /><span>Photoshop</span></div>
              <div className="paper-cutout-skill"><div className="pin pin-green"></div><img src="/images/tools/lightroom.svg" alt="Lightroom" /><span>Lightroom</span></div>
              <div className="paper-cutout-skill"><div className="pin pin-red"></div><img src="/images/tools/capcut.svg" alt="CapCut" /><span>CapCut</span></div>
            </div>
          </section>
        </div>

        {/* Contact Info */}
        <div className="contact-skills-row" style={{ marginTop: 'var(--space-md)' }}>
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
        </div>
      </aside>
    </div>
  );

  const renderDesktopLeftAbout = () => (
    <div className="page-content-wrapper about-view">
      <aside className="about-sidebar">
        <div className="profile-card">
          <img src="/images/profile.jpg" alt="Yongqian (Leo) Li Profile Photo" className="profile-img" loading="lazy" />
          <h1 className="profile-name">YONGQIAN (LEO) LI 李泳谦</h1>
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
                          <div className="dock-item"><img src="/images/tools/premierepro.svg" alt="Premiere Pro" /><span className="dock-tooltip">Premiere Pro</span></div>
                          <div className="dock-item"><img src="/images/tools/davinciresolve.svg" alt="DaVinci Resolve" /><span className="dock-tooltip">DaVinci Resolve</span></div>
                          <div className="dock-item"><img src="/images/tools/photoshop.svg" alt="Photoshop" /><span className="dock-tooltip">Photoshop</span></div>
                          <div className="dock-item"><img src="/images/tools/lightroom.svg" alt="Lightroom" /><span className="dock-tooltip">Lightroom</span></div>
                          <div className="dock-item"><img src="/images/tools/capcut.svg" alt="CapCut" /><span className="dock-tooltip">CapCut</span></div>
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
      </div>
    </div>
  );

  return (
    <>
      <div id="canvas-container">
        <div id="mobile-header-mask"></div>
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
                <button className="divider-tab" data-category="about" role="tab" aria-selected="false">
                  <span className="tab-badge">🙋</span> <span className="tab-label">About Me</span>
                </button>
                <button className="divider-tab" data-category="videos" role="tab" aria-selected="false">
                  <span className="tab-badge">🎬</span> <span className="tab-label">Videos</span>
                </button>
                <button className="divider-tab" data-category="photowalk" role="tab" aria-selected="false">
                  <span className="tab-badge">📷</span> <span className="tab-label">Photowalk</span>
                </button>
                <button className="divider-tab" data-category="people" role="tab" aria-selected="false">
                  <span className="tab-badge">👥</span> <span className="tab-label">People</span>
                </button>
                <button className="divider-tab active" data-category="nature" role="tab" aria-selected="true">
                  <span className="tab-badge">🍃</span> <span className="tab-label">Nature</span>
                </button>
              </div>

              <div className="page-paper">
                <div className="page-content-wrapper portfolio-view">
                  <h2 className="page-title" id="photos-title">Nature</h2>
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
              <div className="top-tabs" role="tablist" aria-label="Right Page Sections">
                <button className="top-tab about-tab" data-category="about" role="tab" aria-selected="false">
                  <span className="tab-badge">🙋</span> <span className="tab-label">About Me</span>
                </button>
                <button className="top-tab videos-tab active" data-category="videos" role="tab" aria-selected="true">
                  <span className="tab-badge">🎬</span> <span className="tab-label">Videos</span>
                </button>
                <button className="top-tab prev-tab" data-category="go-back" role="tab" aria-selected="false">
                  <span className="tab-badge">👈</span> <span className="tab-label">PREV</span>
                </button>
              </div>

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
                  </div>
                </div>

                {!isMobile && renderDesktopRightAbout()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
