import React from 'react';

export default function Navigation() {
  return (
    <>
      <div className="top-header-blur"></div>
      <div className="top-left-brand">
        <div className="brand-container">
          <button type="button" className="brand-logo" id="brand-logo">Yongqian (Leo) Li <span lang="zh">李泳谦</span></button>
          <nav className="brand-nav" id="brand-nav">
            <button type="button" className="nav-item nav-home" id="nav-home">Home</button>
            <button type="button" className="nav-item" id="nav-portfolio">Portfolio</button>
            <button type="button" className="nav-item" id="nav-about">About Me</button>
          </nav>
        </div>
      </div>
      <div className="top-right-controls">
        <button type="button" className="sound-toggle-btn" id="btn-sound" aria-label="Toggle Sound Effects" title="Toggle Sound Effects">
          <i className="fa-solid fa-volume-high" aria-hidden="true"></i>
        </button>
        <button type="button" className="theme-toggle-btn" id="btn-theme" aria-label="Toggle Dark/Light Mode">
          <i className="fa-regular fa-moon" aria-hidden="true"></i>
        </button>
      </div>
    </>
  );
}
