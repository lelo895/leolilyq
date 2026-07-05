import React from 'react';

export default function Navigation() {
  return (
    <>
      <div className="top-left-brand">
        <div className="brand-container">
          <a href="#" className="brand-logo" id="brand-logo">Yongqian (Leo) Li 李泳谦</a>
          <nav className="brand-nav" id="brand-nav">
            <a href="#" className="nav-item nav-home" id="nav-home">Home</a>
            <a href="#" className="nav-item" id="nav-portfolio">Portfolio</a>
            <a href="#" className="nav-item" id="nav-about">About Me</a>
          </nav>
        </div>
      </div>
      <div className="top-right-controls">
        <button className="sound-toggle-btn" id="btn-sound" aria-label="Toggle Sound Effects" title="Toggle Sound Effects">
          <i className="fa-solid fa-volume-high"></i>
        </button>
        <button className="theme-toggle-btn" id="btn-theme" aria-label="Toggle Dark/Light Mode">
          <i className="fa-regular fa-moon"></i>
        </button>
      </div>
    </>
  );
}
