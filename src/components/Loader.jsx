import React from 'react';

export default function Loader() {
  return (
    <>
      <div id="spotlight-overlay"></div>
      <section id="leo-loader" className="leo-loader">
        <div className="leo-loader__content">
          <div className="leo-loader__h1">
            <span className="leo-loader__letter">L</span>
            <span className="leo-loader__letter">E</span>
            <div className="leo-loader__o-container" id="loader-o-container">
              <div className="aperture" id="loader-aperture">
                <div className="aperture-blade"></div>
                <div className="aperture-blade"></div>
                <div className="aperture-blade"></div>
                <div className="aperture-blade"></div>
                <div className="aperture-blade"></div>
                <div className="aperture-blade"></div>
                <div className="aperture-blade"></div>
                <div className="aperture-blade"></div>
              </div>
              <span className="leo-loader__letter--o">O</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
