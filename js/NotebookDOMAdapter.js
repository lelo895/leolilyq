export default class NotebookDOMAdapter {
  setMobileTab(category) {
    document.body.setAttribute('data-mobile-tab', category);
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

  updatePhotosTitle(cat) {
    const photosTitle = document.getElementById('photos-title');
    if (photosTitle) photosTitle.textContent = cat;
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
  }

  isShowingAbout() {
    const notebook = document.querySelector('.notebook');
    return notebook ? notebook.classList.contains('show-about') : false;
  }
}
