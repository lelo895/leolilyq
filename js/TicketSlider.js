export default class TicketSlider {
  constructor({ data, onOpenDetails, setActiveClickedImg }) {
    this._data = data;
    this._onOpenDetails = onOpenDetails;
    this._setActiveClickedImg = setActiveClickedImg;
  }

  render() {
    const ticketsGrid = document.getElementById('tickets-grid');
    if (!ticketsGrid) return;

    ticketsGrid.innerHTML = '';

    if (!Array.isArray(this._data)) {
      console.warn('data is not defined');
      return;
    }

    const videosData = this._data.filter(item => item.category === 'videos');
    const infiniteData = [...videosData, ...videosData, ...videosData];
    let isSwiping = false;

    infiniteData.forEach((item, index) => {
      const ticket = document.createElement('div');
      ticket.className = 'movie-ticket';

      const posterWrapper = document.createElement('div');
      posterWrapper.className = 'ticket-poster-wrapper';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title;
      img.loading = index > 1 ? 'lazy' : 'eager';

      const playOverlay = document.createElement('div');
      playOverlay.className = 'ticket-play-overlay';
      playOverlay.innerHTML = '<i class="fa-solid fa-circle-play"></i>';

      posterWrapper.appendChild(img);
      posterWrapper.appendChild(playOverlay);

      const perforations = document.createElement('div');
      perforations.className = 'ticket-perforations';

      const notchL = document.createElement('div');
      notchL.className = 'ticket-notch-left';
      const notchR = document.createElement('div');
      notchR.className = 'ticket-notch-right';

      perforations.appendChild(notchL);
      perforations.appendChild(notchR);

      const infoStub = document.createElement('div');
      infoStub.className = 'ticket-info-stub';

      const title = document.createElement('h3');
      title.className = 'ticket-title';
      title.textContent = item.title;

      const meta1 = document.createElement('div');
      meta1.className = 'ticket-meta-row';
      meta1.innerHTML = `<span class="ticket-meta-label">SCREEN</span><span>01</span>`;

      const meta2 = document.createElement('div');
      meta2.className = 'ticket-meta-row';
      meta2.innerHTML = `<span class="ticket-meta-label">RATING</span><span>PG-13</span>`;

      const divider = document.createElement('div');
      divider.className = 'ticket-divider';

      const seatMeta = document.createElement('div');
      seatMeta.className = 'ticket-seat-meta';

      const rows = ['A', 'B', 'C', 'D', 'E'];
      const originalIndex = index % videosData.length;
      const rowVal = rows[originalIndex] || 'A';
      const seatVal = originalIndex + 1;

      seatMeta.innerHTML = `
        <div class="seat-item">
          <span class="seat-label">ADMIT</span>
          <span class="seat-value">1</span>
        </div>
        <div class="seat-item">
          <span class="seat-label">ROW</span>
          <span class="seat-value">${rowVal}</span>
        </div>
        <div class="seat-item">
          <span class="seat-label">SEAT</span>
          <span class="seat-value">${seatVal}</span>
        </div>
      `;

      const barcode = document.createElement('div');
      barcode.className = 'ticket-barcode';

      infoStub.appendChild(title);
      infoStub.appendChild(meta1);
      infoStub.appendChild(meta2);
      infoStub.appendChild(divider);
      infoStub.appendChild(seatMeta);
      infoStub.appendChild(barcode);

      ticket.appendChild(posterWrapper);
      ticket.appendChild(perforations);
      ticket.appendChild(infoStub);

      ticket.addEventListener('click', (e) => {
        if (isSwiping) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (index === currentTicketIndex) {
          if (ticket.dataset.animating === "true") return;
          ticket.dataset.animating = "true";

          const rect = ticket.getBoundingClientRect();
          const clone = ticket.cloneNode(true);

          clone.style.position = 'fixed';
          clone.style.margin = '0';
          clone.style.left = `${rect.left}px`;
          clone.style.top = `${rect.top}px`;
          clone.style.width = `${rect.width}px`;
          clone.style.height = `${rect.height}px`;
          clone.style.zIndex = '9999';
          clone.style.transform = 'none';
          clone.classList.remove('focused-ticket');

          document.body.appendChild(clone);
          ticket.style.opacity = '0';

          const overlay = document.createElement('div');
          overlay.className = 'ticket-focus-overlay';
          document.body.appendChild(overlay);

          void clone.offsetWidth;

          overlay.classList.add('visible');

          clone.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          clone.style.left = '50%';
          clone.style.top = '50%';
          clone.style.transform = 'translate(-50%, -50%) scale(1.2)';

          setTimeout(() => {
            ticket.dataset.animating = "false";
            ticket.style.opacity = '';
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 600);

            this._setActiveClickedImg(clone);
            this._onOpenDetails(item);
          }, 850);
        } else {
          console.log("Navigating to ticket index: ", index);
          if (typeof isSliderTransitioning !== 'undefined' && isSliderTransitioning) return;
          isSliderTransitioning = true;

          currentTicketIndex = index;
          updateTicketSlider(true);

          setTimeout(() => {
            if (currentTicketIndex < originalLength) {
              currentTicketIndex += originalLength;
              updateTicketSlider(false);
            } else if (currentTicketIndex >= originalLength * 2) {
              currentTicketIndex -= originalLength;
              updateTicketSlider(false);
            }
            isSliderTransitioning = false;
          }, 400);
        }
      });

      ticketsGrid.appendChild(ticket);
    });

    const originalLength = videosData.length;
    let currentTicketIndex = originalLength + Math.floor(originalLength / 2);
    const prevBtn = document.getElementById('ticket-slider-prev');
    const nextBtn = document.getElementById('ticket-slider-next');
    let isSliderTransitioning = false;

    function updateTicketSlider(animate = true) {
      const tickets = ticketsGrid.querySelectorAll('.movie-ticket');
      if (tickets.length === 0) return;

      tickets.forEach((t, i) => {
        if (i === currentTicketIndex) {
          t.classList.add('focused-ticket');
        } else {
          t.classList.remove('focused-ticket');
        }
      });

      const trackWrapper = document.querySelector('.tickets-track-wrapper');
      if (trackWrapper) {
        const ticketEl = ticketsGrid.querySelector('.movie-ticket');
        const ticketWidth = ticketEl ? ticketEl.offsetWidth : 340;
        let gap = 30;
        if (ticketEl) {
          const gridStyle = window.getComputedStyle(ticketsGrid);
          const gridGap = gridStyle.getPropertyValue('gap');
          if (gridGap) gap = parseInt(gridGap, 10) || 30;
        }
        const trackWidth = trackWrapper.offsetWidth;

        const centerOffset = (trackWidth - ticketWidth) / 2;
        const translateX = -(currentTicketIndex * (ticketWidth + gap)) + centerOffset;

        if (!animate) {
          ticketsGrid.classList.add('no-transition');
          ticketsGrid.style.transform = `translateX(${translateX}px)`;
          void ticketsGrid.offsetWidth;
          ticketsGrid.classList.remove('no-transition');
        } else {
          ticketsGrid.classList.remove('no-transition');
          ticketsGrid.style.transform = `translateX(${translateX}px)`;
        }
      }
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (isSliderTransitioning) return;

        const tickets = ticketsGrid.querySelectorAll('.movie-ticket');
        if (tickets.length === 0) return;

        isSliderTransitioning = true;
        currentTicketIndex--;
        updateTicketSlider(true);

        setTimeout(() => {
          if (currentTicketIndex < originalLength) {
            currentTicketIndex += originalLength;
            updateTicketSlider(false);
          }
          isSliderTransitioning = false;
        }, 400);
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (isSliderTransitioning) return;

        const tickets = ticketsGrid.querySelectorAll('.movie-ticket');
        if (tickets.length === 0) return;

        isSliderTransitioning = true;
        currentTicketIndex++;
        updateTicketSlider(true);

        setTimeout(() => {
          if (currentTicketIndex >= originalLength * 2) {
            currentTicketIndex -= originalLength;
            updateTicketSlider(false);
          }
          isSliderTransitioning = false;
        }, 400);
      };
    }

    setTimeout(updateTicketSlider, 50);

    let touchStartX = 0;
    let touchEndX = 0;

    function handleSwipe() {
      const swipeThreshold = 40;
      if (touchEndX < touchStartX - swipeThreshold) {
        if (nextBtn) nextBtn.onclick();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        if (prevBtn) prevBtn.onclick();
      }
    }

    ticketsGrid.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      isSwiping = false;
    }, { passive: true });

    ticketsGrid.addEventListener('touchmove', e => {
      if (Math.abs(e.changedTouches[0].screenX - touchStartX) > 10) {
        isSwiping = true;
      }
    }, { passive: true });

    ticketsGrid.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      if (isSwiping) handleSwipe();
      setTimeout(() => { isSwiping = false; }, 50);
    }, { passive: true });

    let mouseStartX = 0;
    ticketsGrid.addEventListener('mousedown', e => {
      mouseStartX = e.screenX;
      isSwiping = false;
    });

    ticketsGrid.addEventListener('mousemove', e => {
      if (e.buttons === 1) {
        if (Math.abs(e.screenX - mouseStartX) > 10) {
          isSwiping = true;
        }
      }
    });

    ticketsGrid.addEventListener('mouseup', e => {
      touchEndX = e.screenX;
      touchStartX = mouseStartX;
      if (isSwiping) handleSwipe();
      setTimeout(() => { isSwiping = false; }, 50);
    });

    ticketsGrid.addEventListener('mouseleave', e => {
      if (isSwiping && e.buttons === 1) {
        touchEndX = e.screenX;
        touchStartX = mouseStartX;
        handleSwipe();
      }
      setTimeout(() => { isSwiping = false; }, 50);
    });
  }
}
