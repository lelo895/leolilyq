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

    this._domAdapter.updateAriaSelected(cat, this._gallery.category);

    const wasShowingAbout = cat !== 'about' && this._domAdapter.isShowingAbout();
    if (wasShowingAbout) {
      this._domAdapter.removeShowAbout();
      this._domAdapter.zoomLeft();
    }

    if (cat === 'about') {
      this._domAdapter.setActiveTab('about');
      if (!window.matchMedia('(max-width: 900px)').matches && !this._domAdapter.isShowingAbout()) {
        this._doPageFlip('next');
      }
      return;
    }

    if (cat === 'videos') {
      this._domAdapter.setActiveTab('videos');
      this._runViewTransition(() => {
        this._domAdapter.zoomRight();
      });
      this._ticketSlider.render();
      this._domAdapter.reAnimateElements('.movie-ticket');
      return;
    }

    if (cat === 'go-back') {
      this._domAdapter.setActiveTab(this._gallery.category);
      this._runViewTransition(() => {
        this._domAdapter.zoomLeft();
      });
      return;
    }

    if (cat === this._gallery.category && !wasShowingAbout) return;

    const applyCategorySwitch = () => {
      this._gallery.renderPhotos(cat);
      this._domAdapter.setActiveTab(cat);
      this._domAdapter.updatePhotosTitle(cat);
      this._domAdapter.scrollPhotosToTop();
      this._domAdapter.reAnimateElements('.scrapbook-photo');
      this._domAdapter.scrollToLeftPage();
    };

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._doPageFlip('prev', applyCategorySwitch);
    } else {
      applyCategorySwitch();
    }
  }
}
