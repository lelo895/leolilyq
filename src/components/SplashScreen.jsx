import React from 'react';

export default function SplashScreen() {
  return (
    <div id="splash-screen">
      <div className="journal-wrapper" id="journal-trigger" role="button" tabIndex={0} aria-label="Open portfolio journal">
        <div className="journal">
          {/* Decoy pages visible during opening flip */}
          <div className="journal-pages-decoy"></div>

          {/* Decorative tabs peeking out when closed */}
          <div className="journal-decor-tabs">
            <div className="journal-decor-tab decor-videos" title="Videos"></div>
            <div className="journal-decor-tab decor-photowalk" title="Photowalk"></div>
            <div className="journal-decor-tab decor-people" title="People"></div>
            <div className="journal-decor-tab decor-nature" title="Nature"></div>
          </div>

          <div className="journal-cover">
            <div className="stitching"></div>

            <div className="bookmark-ribbon"></div>
            <div className="journal-strap">
              <div className="strap-knot"></div>
            </div>
            <div className="journal-pen">
              <div className="pen-clip"></div>
            </div>
          </div>
        </div>
        {/* Tooltip */}
        <div className="drag-tooltip">Leo's Photobook</div>
      </div>

      {/* Draggable Camera */}
      <div className="item-wrapper camera-wrapper" id="camera-trigger" role="button" tabIndex={0} aria-label="Leo's Photobook">
        <div className="camera-body">
          {/* Flash unit that pops up */}
          <div className="camera-flash-unit">
            <div className="camera-flash-light"></div>
          </div>
          {/* Camera details */}
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
        {/* Tooltip */}
        <div className="drag-tooltip">Canon EOS Rebel T7 DSLR Camera</div>
      </div>

      {/* Draggable Mahjong */}
      <div className="item-wrapper mahjong-wrapper" id="mahjong-trigger" role="button" tabIndex={0} aria-label="Play with mahjong tile">
        <div className="mahjong-tile">
          <div className="mahjong-front">發</div>
        </div>
        <div className="drag-tooltip">Mahjong Tile</div>
      </div>

      {/* Draggable Badminton Birdie */}
      <div className="item-wrapper birdie-wrapper" id="birdie-trigger" role="button" tabIndex={0} aria-label="Play with badminton birdie">
        <div className="birdie">
          <div className="birdie-feathers">
            <div className="feather feather-1"></div>
            <div className="feather feather-2"></div>
            <div className="feather feather-3"></div>
            <div className="feather feather-4"></div>
            <div className="feather feather-5"></div>
          </div>
          <div className="birdie-band"></div>
          <div className="birdie-cork"></div>
        </div>
        <div className="drag-tooltip">Badminton Birdie</div>
      </div>

      {/* Draggable Tennis Ball */}
      <div className="item-wrapper tennis-wrapper" id="tennis-trigger" role="button" tabIndex={0} aria-label="Play with tennis ball">
        <div className="tennis-ball"></div>
        <div className="drag-tooltip">Tennis Ball</div>
      </div>

      {/* Draggable Board Game */}
      <div className="item-wrapper boardgame-wrapper" id="boardgame-trigger" role="button" tabIndex={0} aria-label="Play board game">
        <div className="bg-piece bg-pawn-ruby">
          <div className="pawn-head"></div>
        </div>
        <div className="bg-piece bg-pawn-emerald">
          <div className="pawn-head"></div>
        </div>
        <div className="bg-piece bg-pawn-amber">
          <div className="pawn-head"></div>
        </div>
        <div className="bg-die">
          <div className="die-face die-front" data-value="5">
            <span className="dot top-left"></span>
            <span className="dot top-right"></span>
            <span className="dot center-left"></span>
            <span className="dot center"></span>
            <span className="dot center-right"></span>
            <span className="dot bottom-left"></span>
            <span className="dot bottom-right"></span>
          </div>
        </div>
        <div className="drag-tooltip">Board Game Pieces</div>
      </div>

      {/* Item Info Panel (shows when book is centered) */}
      <div className="splash-item-info" id="splash-item-info">
        <h2 className="item-name">Leo's Photobook</h2>
        <p className="item-desc">A collection of his work.</p>
      </div>

      {/* Guide text (shows after delay) */}
      <div className="splash-guide" id="splash-guide">
        Press book to open
      </div>

      {/* Close button for centered state */}
      <div className="splash-close" id="splash-close" title="Return to draggable mode">
        <i className="fa-solid fa-xmark"></i>
      </div>

      <div className="splash-prompt">
        <span className="prompt-text">YONGQIAN (LEO) LI</span>
      </div>
    </div>
  );
}
