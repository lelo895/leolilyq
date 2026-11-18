export default class Gallery {
  constructor({ data, onOpenDetails, setActiveClickedImg }) {
    this._data = data;
    this._onOpenDetails = onOpenDetails;
    this._setActiveClickedImg = setActiveClickedImg;
    this._activeCategory = 'nature';
    this._currentPage = 0;
    this._pageSize = 9;
    this._categories = ['nature', 'people', 'photowalk'];
    this._shuffledCache = {}; // cache shuffled arrays per category
  }

  get pageSize() {
    const isMobile = window.innerWidth <= 1024 || (window.innerWidth <= 1366 && window.matchMedia('(hover: none)').matches);
    if (isMobile) {
      // Auto-fit 6 photos on taller phones (iPhone XR/11/12/13/14/15) vs 4 photos on smaller phones (iPhone SE)
      if (window.innerHeight >= 740) {
        return 6;
      }
      return 4;
    }
    return 9;
  }

  get category() {
    return this._activeCategory;
  }

  set category(cat) {
    if (this._activeCategory !== cat) {
      this._activeCategory = cat;
      this._currentPage = 0;
      // Re-shuffle for new category
      delete this._shuffledCache[cat];
    }
  }

  get currentPage() {
    return this._currentPage;
  }

  reset() {
    this._activeCategory = 'nature';
    this._currentPage = 0;
  }

  nextCategory() {
    const idx = this._categories.indexOf(this._activeCategory);
    const nextIdx = (idx + 1) % this._categories.length;
    this.renderPhotos(this._categories[nextIdx], 0);
    return this._categories[nextIdx];
  }

  prevCategory() {
    const idx = this._categories.indexOf(this._activeCategory);
    const prevIdx = (idx - 1 + this._categories.length) % this._categories.length;
    this.renderPhotos(this._categories[prevIdx], 0);
    return this._categories[prevIdx];
  }

  nextPage() {
    const totalItems = this._getFilteredData().length;
    const size = this.pageSize;
    if ((this._currentPage + 1) * size < totalItems) {
      this._currentPage++;
      this.renderPhotos(this._activeCategory, this._currentPage);
    }
  }

  prevPage() {
    if (this._currentPage > 0) {
      this._currentPage--;
      this.renderPhotos(this._activeCategory, this._currentPage);
    }
  }

  _shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  _getFilteredData() {
    if (!Array.isArray(this._data)) return [];
    const cat = this._activeCategory;
    // Return cached shuffle if exists
    if (this._shuffledCache[cat]) return this._shuffledCache[cat];
    const filtered = this._data.filter(item => {
      if (item.type !== 'image') return false;
      if (cat === 'videos') return item.category === 'nature';
      return item.category === cat;
    });
    // Shuffle and cache
    this._shuffledCache[cat] = this._shuffleArray(filtered);
    return this._shuffledCache[cat];
  }

  /** Initial render — photos only now */
  renderAll() {
    this.renderPhotos();
  }

  /** Re-render photos grid for a category and page */
  renderPhotos(cat, page) {
    if (cat !== undefined) {
      if (this._activeCategory !== cat) {
        this._currentPage = 0;
      }
      this._activeCategory = cat;
    }
    if (page !== undefined) {
      this._currentPage = page;
    }

    const photosGrid = document.getElementById('photos-grid');
    if (!photosGrid) return;

    photosGrid.innerHTML = '';

    const photosData = this._getFilteredData();
    const totalItems = photosData.length;
    const size = this.pageSize;
    const startIndex = this._currentPage * size;
    const pagedPhotos = photosData.slice(startIndex, startIndex + size);

    pagedPhotos.forEach((item, index) => {
      const card = document.createElement('div');
      // Dynamic layout formats for an authentic tactile scrapbook
      const formatType = (index % 4 === 0) ? 'format-polaroid' : (index % 4 === 2) ? 'format-hero' : 'format-standard';
      card.className = `scrapbook-photo ${formatType} animate-in`;
      card.style.animationDelay = `${index * 0.04}s`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', item.description || item.title || 'View photo details');

      const rot = (Math.random() * 3.6 - 1.8).toFixed(2);
      card.style.transform = `rotate(${rot}deg)`;

      // Washi tape placements based on format
      if (formatType === 'format-polaroid') {
        const tapeTop = document.createElement('div');
        tapeTop.className = 'photo-tape photo-tape-top';
        card.appendChild(tapeTop);
      } else {
        const tapeL = document.createElement('div');
        tapeL.className = 'photo-tape photo-tape-tl';
        const tapeR = document.createElement('div');
        tapeR.className = 'photo-tape photo-tape-tr';
        card.appendChild(tapeL);
        card.appendChild(tapeR);
      }

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.description || item.title || 'Portfolio photograph';
      img.width = 400;
      img.height = 300;
      if (index > 2) {
        img.loading = 'lazy';
      } else {
        img.loading = 'eager';
        if (index === 0) {
          img.setAttribute('fetchpriority', 'high');
        }
      }

      const caption = document.createElement('div');
      caption.className = 'photo-caption';
      const rawText = item.description || item.title || 'Untitled';
      caption.textContent = rawText.length > 34 ? rawText.substring(0, 34).trimEnd() + '…' : rawText;

      card.appendChild(img);
      card.appendChild(caption);

      const openCard = () => {
        this._setActiveClickedImg(img);
        this._onOpenDetails(item);
      };

      card.addEventListener('click', openCard);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCard();
        }
      });

      photosGrid.appendChild(card);
    });

    // Update pagination arrows status
    const prevBtn = document.getElementById('photo-slider-prev');
    const nextBtn = document.getElementById('photo-slider-next');

    if (prevBtn) {
      prevBtn.disabled = this._currentPage === 0;
      prevBtn.classList.toggle('disabled', this._currentPage === 0);
    }
    if (nextBtn) {
      const hasNext = (this._currentPage + 1) * size < totalItems;
      nextBtn.disabled = !hasNext;
      nextBtn.classList.toggle('disabled', !hasNext);
    }
  }
}
