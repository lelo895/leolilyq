export default class NotebookDOMAdapter {
  constructor() {
    this._catIndex = 3; // default to nature (index 3 in middle set)
    this._catLoopTimer = null;
    this._resizeObserver = null;
  }

  setMobileTab(category) {
    document.body.setAttribute('data-mobile-tab', category);
    // Reset scroll position inside the book when switching tabs
    const notebook = document.querySelector('#notebook-container .notebook');
    if (notebook) notebook.scrollTop = 0;
    window.dispatchEvent(new CustomEvent('mobileTabSwitched', { detail: { category } }));
  }

  zoomLeft() {
    const notebookContainer = document.getElementById('notebook-container');
    if (notebookContainer) notebookContainer.className = 'notebook-container state-zoomed-left';
  }

  zoomRight() {
    const notebookContainer = document.getElementById('notebook-container');
    if (notebookContainer) notebookContainer.className = 'notebook-container state-zoomed-right';
  }

  setActiveTab(cat) {
    const dividerTabs = document.querySelectorAll('.divider-tab, .top-tab');
    dividerTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-category') === cat);
    });
  }

  get catIndex() {
    return this._catIndex;
  }

  setCatIndex(idx) {
    this._catIndex = idx;
  }

  updatePhotosTitle(cat = null, explicitIndex = null, animate = true) {
    const track = document.getElementById('category-title-track');
    if (!track || !track.parentElement) return;

    // Attach ResizeObserver if not already attached
    if (!this._resizeObserver && typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => {
        if (document.body.classList.contains('journal-active')) {
          this.updatePhotosTitle(null, null, false);
        }
      });
      this._resizeObserver.observe(track.parentElement);
    }

    const items = track.querySelectorAll('.cat-title-item');
    if (items.length === 0) return;

    const categories = ['nature', 'people', 'photowalk'];
    const originalLength = categories.length;

    if (explicitIndex !== null && explicitIndex >= 0 && explicitIndex < items.length) {
      this._catIndex = explicitIndex;
    } else if (cat) {
      const catLower = cat.toLowerCase();
      const baseIdx = categories.indexOf(catLower);
      if (baseIdx !== -1) {
        const currentMod = (this._catIndex % originalLength + originalLength) % originalLength;
        if (currentMod !== baseIdx) {
          this._catIndex = baseIdx + originalLength;
        }
      }
    }

    const applyPosition = (shouldAnimate = true) => {
      items.forEach((item, idx) => {
        if (idx === this._catIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      const activeItem = items[this._catIndex] || items[3];
      const containerWidth = track.parentElement.offsetWidth || 280;
      const itemCenter = activeItem.offsetLeft + activeItem.offsetWidth / 2;
      const containerCenter = containerWidth / 2;
      const tx = containerCenter - itemCenter;

      if (!shouldAnimate) {
        track.classList.add('no-transition');
        track.style.transform = `translateX(${tx}px)`;
        void track.offsetWidth;
        requestAnimationFrame(() => {
          track.classList.remove('no-transition');
        });
      } else {
        track.classList.remove('no-transition');
        track.style.transform = `translateX(${tx}px)`;
      }
    };

    applyPosition(animate);

    clearTimeout(this._catLoopTimer);
    if (animate) {
      this._catLoopTimer = setTimeout(() => {
        let needsWrap = false;
        if (this._catIndex < originalLength) {
          this._catIndex += originalLength;
          needsWrap = true;
        } else if (this._catIndex >= originalLength * 2) {
          this._catIndex -= originalLength;
          needsWrap = true;
        }
        if (needsWrap) {
          applyPosition(false);
        }
      }, 410);
    }
  }

  scrollPhotosToTop() {
    const pTrack = document.getElementById('photos-track-wrapper');
    if (pTrack) pTrack.scrollLeft = 0;
    const pGrid = document.getElementById('photos-grid');
    if (pGrid) pGrid.scrollTop = 0;
  }

  scrollToLeftPage() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      const leftPage = document.querySelector('.left-page');
      if (leftPage) leftPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  reAnimateElements(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.remove('animate-in');
      void el.offsetWidth;
    });
    requestAnimationFrame(() => {
      document.querySelectorAll(selector).forEach((el, index) => {
        el.style.animationDelay = `${Math.min(index, 10) * 0.05}s`;
        el.classList.add('animate-in');
      });
    });
  }

  updateAriaSelected(cat, currentGalleryCat) {
    const allTabBtns = document.querySelectorAll('.divider-tab, .top-tab');
    allTabBtns.forEach(btn => {
      const btnCat = btn.getAttribute('data-category');
      if (btnCat === cat || (cat === 'go-back' && btnCat === currentGalleryCat)) {
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.setAttribute('aria-selected', 'false');
      }
    });
  }

  removeShowAbout() {
    const notebook = document.querySelector('.notebook');
    if (notebook) notebook.classList.remove('show-about');
    const nc = document.getElementById('notebook-container');
    if (nc) nc.classList.remove('show-about-container');
    const cc = document.getElementById('canvas-container');
    if (cc) cc.classList.remove('about-open');
  }

  isShowingAbout() {
    const notebook = document.querySelector('.notebook');
    return notebook ? notebook.classList.contains('show-about') : false;
  }
}
