export default class Gallery {
  constructor({ data, onOpenDetails, setActiveClickedImg }) {
    this._data = data;
    this._onOpenDetails = onOpenDetails;
    this._setActiveClickedImg = setActiveClickedImg;
    this._activeCategory = 'nature';
  }

  get category() {
    return this._activeCategory;
  }

  set category(cat) {
    this._activeCategory = cat;
  }

  reset() {
    this._activeCategory = 'nature';
  }

  /** Initial render — photos only now */
  renderAll() {
    this.renderPhotos();
  }

  /** Re-render photos grid for a (possibly new) category */
  renderPhotos(cat) {
    if (cat !== undefined) this._activeCategory = cat;

    const photosGrid = document.getElementById('photos-grid');
    if (!photosGrid) return;

    photosGrid.innerHTML = '';

    if (!Array.isArray(this._data)) {
      console.warn('galleryData is not defined');
      return;
    }

    const photosData = this._data.filter(item => {
      if (item.type !== 'image') return false;
      if (this._activeCategory === 'videos') {
        return item.category === 'nature';
      }
      return item.category === this._activeCategory;
    });

    photosData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'scrapbook-photo';

      const rot = (Math.random() * 4 - 2).toFixed(2);
      card.style.transform = `rotate(${rot}deg)`;

      const tapeL = document.createElement('div');
      tapeL.className = 'photo-tape photo-tape-tl';
      const tapeR = document.createElement('div');
      tapeR.className = 'photo-tape photo-tape-tr';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.description || '';
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
      caption.textContent = item.description ? item.description.substring(0, 36) + (item.description.length > 36 ? '...' : '') : 'Untitled';

      card.appendChild(tapeL);
      card.appendChild(tapeR);
      card.appendChild(img);
      card.appendChild(caption);

      card.addEventListener('click', () => {
        this._setActiveClickedImg(img);
        this._onOpenDetails(item);
      });

      photosGrid.appendChild(card);
    });
  }

}
