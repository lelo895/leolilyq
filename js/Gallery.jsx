import React from 'react';
import { createRoot } from 'react-dom/client';
import TiltedCard from '../src/components/TiltedCard.jsx';

export default class Gallery {
  constructor({ data, onOpenDetails, setActiveClickedImg }) {
    this._data = data;
    this._onOpenDetails = onOpenDetails;
    this._setActiveClickedImg = setActiveClickedImg;
    this._activeCategory = 'nature';
    this._currentPage = 0;
    this._pageSize = 9;
    this._categories = ['nature', 'people', 'photowalk'];
    this._roots = [];
  }

  get pageSize() {
    if (window.matchMedia('(max-width: 600px)').matches) {
      return 6;
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

  _getFilteredData() {
    if (!Array.isArray(this._data)) return [];
    return this._data.filter(item => {
      if (item.type !== 'image') return false;
      if (this._activeCategory === 'videos') {
        return item.category === 'nature';
      }
      return item.category === this._activeCategory;
    });
  }

  /** Initial render — photos only now */
  renderAll() {
    this.renderPhotos();
  }

  _cleanupRoots() {
    this._roots.forEach(root => {
      try {
        root.unmount();
      } catch (e) {
        // Ignore unmount errors if element detached
      }
    });
    this._roots = [];
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

    this._cleanupRoots();
    photosGrid.innerHTML = '';

    const photosData = this._getFilteredData();
    const totalItems = photosData.length;
    const size = this.pageSize;
    const startIndex = this._currentPage * size;
    const pagedPhotos = photosData.slice(startIndex, startIndex + size);

    pagedPhotos.forEach((item, index) => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'tilted-card-wrapper animate-in';
      cardContainer.style.animationDelay = `${index * 0.04}s`;
      cardContainer.style.width = '100%';
      cardContainer.style.height = '100%';

      const rot = (Math.random() * 4 - 2).toFixed(2);

      const root = createRoot(cardContainer);
      this._roots.push(root);

      const captionText = item.description ? item.description.substring(0, 36) + (item.description.length > 36 ? '...' : '') : 'Untitled';

      root.render(
        <TiltedCard
          imageSrc={item.src}
          altText={item.description || ''}
          scaleOnHover={1.15}
          rotateAmplitude={12}
          showMobileWarning={false}
          showTooltip={false}
          onClick={() => {
            const imgEl = cardContainer.querySelector('img');
            this._setActiveClickedImg(imgEl);
            this._onOpenDetails(item);
          }}
        >
          <div className="scrapbook-photo" style={{ transform: `rotate(${rot}deg)` }}>
            <div className="photo-tape photo-tape-tl"></div>
            <div className="photo-tape photo-tape-tr"></div>
            <img
              src={item.src}
              alt={item.description || ''}
              loading={index > 2 ? 'lazy' : 'eager'}
              fetchPriority={index === 0 ? 'high' : undefined}
            />
            <div className="photo-caption">{captionText}</div>
          </div>
        </TiltedCard>
      );

      photosGrid.appendChild(cardContainer);
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

