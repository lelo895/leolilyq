export default class NotebookRouter {
  constructor({ gallery, ticketSlider, domAdapter, audioEngine, runViewTransition, doPageFlip }) {
    this._gallery = gallery;
    this._ticketSlider = ticketSlider;
    this._domAdapter = domAdapter;
    this._audioEngine = audioEngine;
    this._runViewTransition = runViewTransition;
    this._doPageFlip = doPageFlip;
  }

  navigate(cat) {
    if (cat === 'next' || cat === 'prev') return;

    this._domAdapter.setMobileTab(cat === 'go-back' ? this._gallery.category : cat);

    this._audioEngine.play('flip');

    if (cat === 'about') {
      this._domAdapter.setActiveTab('about');
      this._domAdapter.updateAriaSelected('about', this._gallery.category);
      if (!window.matchMedia('(max-width: 900px)').matches && !this._domAdapter.isShowingAbout()) {
        this._doPageFlip('next');
      }
      return;
    }

    if (cat === 'videos') {
      this._domAdapter.setActiveTab('videos');
      this._domAdapter.updateAriaSelected('videos', this._gallery.category);
      const wasShowingAbout = this._domAdapter.isShowingAbout();
      if (wasShowingAbout) {
        this._domAdapter.removeShowAbout();
      }
      if (!window.matchMedia('(max-width: 900px)').matches) {
        this._domAdapter.zoomRight();
      }
      if (this._ticketSlider) {
        setTimeout(() => this._ticketSlider.update(false), 20);
        setTimeout(() => this._ticketSlider.update(false), 150);
      }
      return;
    }

    // Default portfolio tab or category route
    const wasShowingAbout = this._domAdapter.isShowingAbout();
    if (wasShowingAbout) {
      this._domAdapter.removeShowAbout();
      this._domAdapter.zoomLeft();
    }

    const targetCat = (cat === 'portfolio' || cat === 'go-back') ? this._gallery.category : cat;
    this._domAdapter.setActiveTab('portfolio');
    this._domAdapter.updateAriaSelected('portfolio', this._gallery.category);

    const applyCategorySwitch = () => {
      this._gallery.renderPhotos(targetCat);
      this._domAdapter.updatePhotosTitle(targetCat);
      this._ticketSlider.render();
      this._domAdapter.reAnimateElements('.scrapbook-photo, .movie-ticket');
    };

    if (wasShowingAbout && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._doPageFlip('prev', applyCategorySwitch);
    } else {
      applyCategorySwitch();
    }
  }
}
