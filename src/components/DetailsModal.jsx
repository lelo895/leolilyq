import React from 'react';

export default function DetailsModal() {
  return (
    <div className="modal" id="details-modal" aria-hidden="true" inert="true" role="dialog">
      <div className="modal-backdrop"></div>
      <div className="modal-wrapper">
        <button className="modal-close" id="close-details" aria-label="Close details modal">&times;</button>
        <div className="details-content-grid">
          <div className="details-media-panel">
            {/* Populated dynamically (img or iframe) */}
            <div id="details-media-container"></div>
          </div>
          <div className="details-info-panel">
            <div className="info-header">
              <span className="info-category" id="details-category">NATURE</span>
              <h2 className="info-title" id="details-title">Project Title</h2>
            </div>
            <div className="info-body">
              <p className="info-description" id="details-description">Project details and concept description go here.</p>
              <div className="info-metadata">
                <div className="meta-row" id="meta-role-row">
                  <span className="meta-label">Role(s)</span>
                  <span className="meta-value" id="details-role">Director, Editor</span>
                </div>
                <div className="meta-row" id="meta-gear-row">
                  <span className="meta-label">Equipment</span>
                  <span className="meta-value" id="details-gear">Sony a7 IV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
