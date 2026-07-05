import React from 'react';

export default function Notebook() {
  return (
    <div id="canvas-container">
      <div id="mobile-header-mask"></div>
      <div id="notebook-container" className="notebook-container">
        <div className="notebook">
          {/* Crease spine with metal binder rings */}
          <div className="notebook-spine">
            <div className="spine-ring ring-1"></div>
            <div className="spine-ring ring-2"></div>
            <div className="spine-ring ring-3"></div>
            <div className="spine-ring ring-4"></div>
          </div>

          {/* Left Page: Photo Scrapbook */}
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
                                  {/* macOS Top Bar */}
                                  <div className="mac-top-bar">
                                    <div className="mac-top-bar-left">
                                      <i className="fa-brands fa-apple"></i>
                                      <span>Finder</span>
                                      <span>File</span>
                                      <span>Edit</span>
                                    </div>
                                    <div className="mac-top-bar-right">
                                      <i className="fa-solid fa-wifi"></i>
                                      <i className="fa-solid fa-battery-full"></i>
                                      <span className="mac-time" id="macTime">10:00 AM</span>
                                    </div>
                                  </div>
                                  <div className="mac-screen">
                                    <div className="active-app-display" id="activeAppDisplay">
                                      <img src="" alt="" className="active-app-icon" id="activeAppIcon" />
                                      <span className="active-app-name" id="activeAppName"></span>
                                    </div>
                                  </div>
                                  <div className="mac-dock">
                                    <div className="dock-item">
                                      <img src="/images/tools/premierepro.svg" alt="Premiere Pro" />
                                      <span className="dock-tooltip">Premiere Pro</span>
                                    </div>
                                    <div className="dock-item">
                                      <img src="/images/tools/davinciresolve.svg" alt="DaVinci Resolve" />
                                      <span className="dock-tooltip">DaVinci Resolve</span>
                                    </div>
                                    <div className="dock-item">
                                      <img src="/images/tools/photoshop.svg" alt="Photoshop" />
                                      <span className="dock-tooltip">Photoshop</span>
                                    </div>
                                    <div className="dock-item">
                                      <img src="/images/tools/lightroom.svg" alt="Lightroom" />
                                      <span className="dock-tooltip">Lightroom</span>
                                    </div>
                                    <div className="dock-item">
                                      <img src="/images/tools/capcut.svg" alt="CapCut" />
                                      <span className="dock-tooltip">CapCut</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="laptop-base">
                                <div className="laptop-notch"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>

          {/* Right Page: Video Tickets */}
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

              <div className="page-content-wrapper about-view">
                <main className="about-main-content">
                  {/* Education Section */}
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

                  {/* Experience Section */}
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
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
