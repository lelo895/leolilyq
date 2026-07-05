import AudioEngine from './AudioEngine.js';
import { defaultStrategies } from './AudioStrategies.js';
import SplashPhysics from './SplashPhysics.js';
import Gallery from './Gallery.js';
import NotebookRouter from './NotebookRouter.js';
import TicketSlider from './TicketSlider.js';
import NotebookDOMAdapter from './NotebookDOMAdapter.js';

gsap.registerPlugin(CustomEase, CustomBounce);

/* ==========================================================================
   PORTFOLIO ENGINE & INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {


  // DOM Elements
  const canvasContainer = document.getElementById('canvas-container');
  const pegboardCanvas = document.getElementById('pegboard-canvas');
  const customCursor = document.getElementById('custom-cursor');
  const btnTheme = document.getElementById('btn-theme');
  const btnSound = document.getElementById('btn-sound');
  // Modals
  const detailsModal = document.getElementById('details-modal');
  const closeDetails = document.getElementById('close-details');
  const detailsMediaContainer = document.getElementById('details-media-container');
  const detailsCategory = document.getElementById('details-category');
  const detailsTitle = document.getElementById('details-title');
  const detailsDescription = document.getElementById('details-description');
  const detailsRole = document.getElementById('details-role');
  const detailsGear = document.getElementById('details-gear');

  // Journal Triggers
  const journalTrigger = document.getElementById('journal-trigger');
  const brandLogo = document.getElementById('brand-logo');

  // State
  // activeCategory is now owned by Gallery — see gallery.category
  let activeCards = [];
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isTransitioningJournal = false;
  let activeClickedImg = null;
  let lastActiveElement = null;


  const audioEngine = new AudioEngine(defaultStrategies);

  function updateSoundIcon() {
    if (!btnSound) return;
    const icon = btnSound.querySelector('i');
    if (!icon) return;
    if (audioEngine.isMuted) {
      icon.className = 'fa-solid fa-volume-xmark';
      btnSound.setAttribute('aria-label', 'Unmute Sound Effects');
      btnSound.title = 'Unmute Sound Effects';
    } else {
      icon.className = 'fa-solid fa-volume-high';
      btnSound.setAttribute('aria-label', 'Mute Sound Effects');
      btnSound.title = 'Mute Sound Effects';
    }
  }

  updateSoundIcon();

  if (btnSound) {
    btnSound.addEventListener('click', () => {
      audioEngine.toggleMute();
      updateSoundIcon();
    });
  }

  // View Transitions API helper
  function runViewTransition(updateCallback) {
    if (document.startViewTransition) {
      return document.startViewTransition(updateCallback);
    } else {
      updateCallback();
      return {
        updateCallbackDone: Promise.resolve(),
        ready: Promise.resolve(),
        finished: Promise.resolve()
      };
    }
  }

  // ==========================================================================
  // CUSTOM CURSOR & PARALLAX EFFECT (Optimized via requestAnimationFrame)
  // ==========================================================================

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const spotlightOverlay = document.getElementById('spotlight-overlay');

  function updateCursorAndParallax() {
    const ease = 0.15;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;

    if (spotlightOverlay) {
      spotlightOverlay.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }

    if (pegboardCanvas) {
      const parallaxX = (cursorX - window.innerWidth / 2) * 0.01;
      const parallaxY = (cursorY - window.innerHeight / 2) * 0.01;
      pegboardCanvas.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0)`;
    }
    requestAnimationFrame(updateCursorAndParallax);
  }

  requestAnimationFrame(updateCursorAndParallax);

  // ==========================================================================
  // JOURNAL SPLASH & PORTFOLIO DECOY TRANSITIONS
  // ==========================================================================

  function updateWrapperDimensions() {
    document.querySelectorAll('.page-paper').forEach(paper => {
      const wrapper = paper.querySelector('.page-content-wrapper');
      if (wrapper) {
        const w = paper.clientWidth;
        const h = paper.clientHeight;
        wrapper.style.width = `${h}px`;
        wrapper.style.height = `${w}px`;
      }
    });
  }

  function openJournal() {
    if (isTransitioningJournal || document.body.classList.contains('journal-active')) return;
    isTransitioningJournal = true;
    sessionStorage.setItem('journalOpened', 'true');

    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('opening');
    }

    const notebookContainer = document.getElementById('notebook-container');
    const journal = document.querySelector('.journal');
    const notebook = document.querySelector('.notebook');

    setTimeout(() => {
      if (journal) journal.style.viewTransitionName = 'notebook-body';

      const transition = runViewTransition(() => {
        if (journal) journal.style.viewTransitionName = '';
        if (notebook) notebook.style.viewTransitionName = 'notebook-body';

        gallery.renderAll();
        audioEngine.play('flip');

        // Hide contents initially for the blank effect
        document.querySelectorAll('.page-content-wrapper').forEach(wrapper => {
          wrapper.style.opacity = '0';
          wrapper.style.transition = 'opacity 0.6s ease';
        });

        document.body.classList.add('journal-active');
        notebookContainer.className = 'notebook-container state-open-blank';
        if (canvasContainer) {
          canvasContainer.scrollTop = 0;
        }

        updateWrapperDimensions();
      });

      const cleanUp = () => {
        if (journal) journal.style.viewTransitionName = '';
        if (notebook) notebook.style.viewTransitionName = '';
      };

      const startZoom = () => {
        // Use double requestAnimationFrame to ensure the browser paints state-open-blank
        // after View Transition teardown before starting the CSS rotation transition.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            notebookContainer.className = 'notebook-container state-zoomed-left';

          const afterZoom = () => {
            document.querySelectorAll('.page-content-wrapper').forEach(wrapper => {
              wrapper.style.opacity = '1';
            });
            isTransitioningJournal = false;

            // Trigger reflow to apply staggered entrance animations
            requestAnimationFrame(() => {
              document.querySelectorAll('.scrapbook-photo, .movie-ticket').forEach((el, index) => {
                const delay = Math.min(index, 10) * 0.08;
                el.style.animationDelay = `${delay}s`;
                el.classList.add('animate-in');
              });
            });
          };
          setTimeout(afterZoom, 800); // 800ms matches the CSS transition duration
          });
        });
      };

      if (transition.finished) {
        transition.finished.then(() => {
          cleanUp();
          startZoom();
        }).catch(() => {
          cleanUp();
          startZoom();
        });
      } else {
        cleanUp();
        startZoom();
      }
    }, 750);
  }

  function closeJournal() {
    if (isTransitioningJournal || !document.body.classList.contains('journal-active')) return;
    isTransitioningJournal = true;

    if (customCursor) {
      customCursor.classList.remove('hovered');
    }

    const notebookContainer = document.getElementById('notebook-container');
    const journal = document.querySelector('.journal');
    const notebook = document.querySelector('.notebook');

    gallery.reset();
    if (notebook) notebook.classList.remove('show-about');

    // Step 1: Use native CSS transition to un-zoom and un-rotate back to portrait
    notebookContainer.className = 'notebook-container state-open-blank';
    
    document.querySelectorAll('.page-content-wrapper').forEach(wrapper => {
      wrapper.style.opacity = '0';
    });

    // Step 2: Wait for CSS transition (800ms) to finish, then View Transition to closed cover
    setTimeout(() => {
      if (notebook) notebook.style.viewTransitionName = 'notebook-body';
      
      const transition = runViewTransition(() => {
        if (notebook) notebook.style.viewTransitionName = '';
        if (journal) journal.style.viewTransitionName = 'notebook-body';

        if (journalTrigger) {
          journalTrigger.style.visibility = 'visible';
          journalTrigger.style.opacity = '1';
        }

        const splash = document.getElementById('splash-screen');
        if (splash) {
          splash.classList.remove('opening');
        }
        document.body.classList.remove('journal-active');
        audioEngine.play('flip');
      });

      const cleanUp = () => {
        if (journal) journal.style.viewTransitionName = '';
        if (notebook) notebook.style.viewTransitionName = '';
      };

      if (transition.finished) {
        transition.finished.then(cleanUp).catch(cleanUp);
      } else {
        cleanUp();
      }

      const afterExit = () => {
        if (journalTrigger) {
          journalTrigger.style.visibility = '';
          journalTrigger.style.opacity = '';
        }

        const photosGrid = document.getElementById('photos-grid');
        const ticketsGrid = document.getElementById('tickets-grid');
        if (photosGrid) photosGrid.innerHTML = '';
        if (ticketsGrid) ticketsGrid.innerHTML = '';
        notebookContainer.className = 'notebook-container';
        isTransitioningJournal = false;

        // Reset splash state so it's clickable again
        if (typeof splashState !== 'undefined') {
          splashState = 'centered';
          document.getElementById('splash-screen').classList.add('focus-journal');
          if (typeof splashItemInfo !== 'undefined' && splashItemInfo) {
            splashItemInfo.classList.add('visible');
          }
          if (typeof splashClose !== 'undefined' && splashClose) {
            splashClose.classList.add('visible');
          }
        }
      };

      if (transition.finished) {
        transition.finished.then(afterExit).catch(afterExit);
      } else {
        setTimeout(afterExit, 750);
      }
    }, 800);
  }

  // ==========================================================================
  // PHYSICS FOR SPLASH BOOK
  // ==========================================================================
  const splashItemInfo = document.getElementById('splash-item-info');
  const splashGuide = document.getElementById('splash-guide');
  const splashClose = document.getElementById('splash-close');
  const cameraTrigger = document.getElementById('camera-trigger');
  const mahjongTrigger = document.getElementById('mahjong-trigger');
  const birdieTrigger = document.getElementById('birdie-trigger');
  const tennisTrigger = document.getElementById('tennis-trigger');
  const boardgameTrigger = document.getElementById('boardgame-trigger');

  let infoTimer = null;
  let guideTimer = null;
  let splashState = 'falling'; // 'falling', 'centered', 'opened'
  let lastMousedownTarget = null;


  const physicsItems = [
    // Journal removed from physics items to stay centered
    {
      id: 'camera',
      el: cameraTrigger,
      x: window.innerWidth <= 600 ? Math.random() * (window.innerWidth - 180) : Math.random() * ((window.innerWidth - 300) / 2 - 180),
      y: -500 - Math.random() * 300,
      vx: (Math.random() - 0.5) * 4,
      vy: 0,
      width: 180,
      height: 120,
      gravity: 0.8,
      bounce: -0.3,
      friction: 0.7,
      dragOffsetX: 0,
      dragOffsetY: 0,
      side: 'left'
    },
    {
      id: 'mahjong',
      el: mahjongTrigger,
      x: window.innerWidth <= 600 ? Math.random() * (window.innerWidth - 90) : (window.innerWidth - 300) / 2 + 300 + Math.random() * (window.innerWidth - ((window.innerWidth - 300) / 2 + 300) - 90),
      y: -600 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 4,
      vy: 0,
      width: 90,
      height: 120,
      gravity: 0.8,
      bounce: -0.4,
      friction: 0.7,
      dragOffsetX: 0,
      dragOffsetY: 0,
      side: 'right'
    },
    {
      id: 'birdie',
      el: birdieTrigger,
      x: window.innerWidth <= 600 ? Math.random() * (window.innerWidth - 70) : Math.random() * ((window.innerWidth - 300) / 2 - 70),
      y: -650 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 4,
      vy: 0,
      width: 70,
      height: 90,
      gravity: 0.3,
      bounce: -0.2,
      friction: 0.9,
      dragOffsetX: 0,
      dragOffsetY: 0,
      side: 'left',
      onUpdate: (item, isDragActive) => {
        item.rotation = item.rotation || 0;
        const floor = window.innerHeight - item.height;
        if (item.y >= floor - 2 && !isDragActive) {
          item.rotation += (75 - item.rotation) * 0.1;
        } else {
          item.rotation += (0 - item.rotation) * 0.1;
        }
        item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
        const inner = item.el.querySelector('.birdie');
        if (inner) inner.style.transform = `rotate(${item.rotation + 180}deg)`;
      }
    },
    {
      id: 'tennis',
      el: tennisTrigger,
      x: window.innerWidth <= 600 ? Math.random() * (window.innerWidth - 70) : Math.random() * ((window.innerWidth - 300) / 2 - 70),
      y: -700 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 6,
      vy: 0,
      width: 70,
      height: 70,
      gravity: 0.5,
      bounce: -0.65,
      friction: 0.9,
      dragOffsetX: 0,
      dragOffsetY: 0,
      side: 'left',
      onDragStart: (item) => {
        gsap.killTweensOf(item);
        if (item.el) {
          gsap.killTweensOf(item.el);
          item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) scale(1, 1)`;
        }
        item.isGSAP = false;
      },
      onReset: (item) => {
        gsap.killTweensOf(item);
        if (item.el) {
          gsap.killTweensOf(item.el);
          item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) scale(1, 1)`;
        }
        item.isGSAP = false;
      },
      onBounce: (item, prevVy) => {
        const squashFactor = Math.min(prevVy / 30, 0.4);
        item.scaleX = 1 + squashFactor;
        item.scaleY = 1 - squashFactor;
        gsap.killTweensOf(item);
        gsap.to(item, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          ease: "elastic.out(1.5, 0.4)"
        });
      },
      onUpdate: (item) => {
        let scaleStr = "";
        if (item.scaleX === undefined) { item.scaleX = 1; item.scaleY = 1; }
        scaleStr = ` scale(${item.scaleX}, ${item.scaleY})`;
        item.el.style.transformOrigin = "center bottom";
        item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)${scaleStr}`;
      }
    },
    {
      id: 'boardgame',
      el: boardgameTrigger,
      x: window.innerWidth <= 600 ? Math.random() * (window.innerWidth - 80) : (window.innerWidth - 300) / 2 + 300 + Math.random() * (window.innerWidth - ((window.innerWidth - 300) / 2 + 300) - 80),
      y: -800 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 4,
      vy: 0,
      width: 80,
      height: 80,
      gravity: 0.6,
      bounce: -0.5,
      friction: 0.8,
      dragOffsetX: 0,
      dragOffsetY: 0,
      side: 'right'
    }
  ];

  document.addEventListener('mousedown', (e) => {
    lastMousedownTarget = e.target;
  });
  document.addEventListener('touchstart', (e) => {
    lastMousedownTarget = e.target;
  }, { passive: true });

  const journalCollider = {
    isActive: () => {
      const jEl = document.getElementById('journal-trigger');
      return jEl && jEl.style.opacity !== '0' && getComputedStyle(jEl).opacity !== '0';
    },
    get x() { return (window.innerWidth - this.width) / 2; },
    get y() { return (window.innerHeight - this.height) / 2; },
    get width() { return 280 * 1.05; },
    get height() { return 380 * 1.05; }
  };

  const physicsTriggers = [journalTrigger, cameraTrigger, boardgameTrigger, mahjongTrigger, birdieTrigger, tennisTrigger];
  physicsTriggers.forEach(trigger => {
    if (trigger) {
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
          // Provide sound feedback if the item doesn't have its own custom click handler
          if (trigger !== journalTrigger && trigger !== cameraTrigger && trigger !== boardgameTrigger) {
             const baseId = trigger.id.replace('-trigger', '');
             audioEngine.play('thud', { type: baseId, impact: 5 });
          }
        }
      });
    }
  });

  const splashPhysics = new SplashPhysics(physicsItems, [journalCollider], {
    onCollision: (itemId, impact) => {
      audioEngine.play('thud', { type: itemId, impact: impact });
      if (itemId === 'boardgame') rollDie();
    },
    onInteract: (item) => {
      audioEngine.play('thud', { type: item.id, impact: 5 });
    },
    onSettle: (item) => {
      if (item.id === 'birdie') audioEngine.play('birdieFall');
    }
  });

  // --- Cinematic Loader Sequence ---
  const leoLoader = document.getElementById('leo-loader');
  const loaderOContainer = document.getElementById('loader-o-container');
  const blades = document.querySelectorAll('.aperture-blade');

  if (leoLoader && loaderOContainer) {
    // 1. Initialize aperture blades
    blades.forEach((blade, i) => {
      // 8 blades, 45 degrees each
      gsap.set(blade, { rotation: i * 45, x: 0, y: 0, scale: 1.1 });
    });

    // 2. Build GSAP Timeline
    const letters = document.querySelectorAll('.leo-loader__letter:not(.leo-loader__letter--o)');

    const loaderTl = gsap.timeline({
      onComplete: () => {
        leoLoader.style.display = 'none';
        
        if (journalTrigger) {
          const centerX = (window.innerWidth - 280) / 2;
          const centerY = (window.innerHeight - 380) / 2;
          journalTrigger.style.position = 'absolute';
          journalTrigger.style.left = '0';
          journalTrigger.style.top = '0';
          journalTrigger.style.transition = 'none';
          journalTrigger.style.transform = `translate(${centerX}px, ${centerY}px) scale(1.05)`;
          
          const splashPrompt = document.querySelector('.splash-prompt');
          if (splashPrompt) splashPrompt.style.display = 'none';
        }

        splashPhysics.start();

        splashState = 'centered';
        
        // Show cover briefly, then open fast
        setTimeout(() => {
          splashState = 'opened';
          if (typeof openJournal === 'function') {
            openJournal();
            setTimeout(() => {
              const natureTab = document.querySelector('.divider-tab[data-category="nature"]');
              if (natureTab) natureTab.click();
            }, 800);
          }
        }, 600);
      }
    });

    // Animate letters (L, E) and the O container up and fade in
    loaderTl.to([...letters, loaderOContainer], {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2
    });

    // Make the outer loader background transparent, so the shadow takes over
    loaderTl.set(leoLoader, { backgroundColor: 'transparent' });

    // 8 aperture blades slide open at the exact same time
    const dist = window.innerWidth > 768 ? 400 : 250;

    loaderTl.add("openAperture", "-=0.4"); // Anchor point for simultaneous animation

    blades.forEach((blade, i) => {
      // The triangle points DOWN. Pull it radially UP relative to its rotation
      const rad = (i * 45 - 90) * (Math.PI / 180);
      loaderTl.to(blade, {
        x: Math.cos(rad) * dist,
        y: Math.sin(rad) * dist,
        rotation: (i * 45) + 90, // Twist
        scale: 1.1,
        duration: 1.2,
        ease: "power3.inOut"
      }, "openAperture"); // Use the label so they start simultaneously!
    });

    // Zoom through the lens! The hole becomes pure white.
    loaderTl.to(loaderOContainer, {
      scale: 50,
      duration: 1.5,
      ease: "power2.inOut"
    }, "-=0.2");

    // Fade out L and E as we zoom
    loaderTl.to(letters, {
      opacity: 0,
      duration: 0.5
    }, "-=1.5");

    // The zoom is complete. Clean up loader quickly.
    loaderTl.to(leoLoader, {
      opacity: 0,
      duration: 0.1
    });

  } else {
    // Fallback if elements are missing
    splashPhysics.start();
  }

  function centerJournal() {
    if (splashState !== 'falling') return;
    
    splashState = 'centered';
    splashPhysics.stop();
    audioEngine.play('transition');
    document.getElementById('splash-screen').classList.add('focus-journal');

    const splashPrompt = document.querySelector('.splash-prompt');
    if (splashPrompt) {
      splashPrompt.style.transition = 'opacity 0.6s ease';
      splashPrompt.style.opacity = '0';
    }

    journalTrigger.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    const centerX = (window.innerWidth - 280) / 2;
    const centerY = (window.innerHeight - 380) / 2;
    
    // Defer the transform change by one frame to ensure the transition property is registered
    // and doesn't get batched with the removal of `transition: none` from the physics engine.
    requestAnimationFrame(() => {
      journalTrigger.style.transform = `translate3d(${centerX}px, ${centerY}px, 0px) scale(1.05)`;
    });

    infoTimer = setTimeout(() => {
      if (splashItemInfo) splashItemInfo.classList.add('visible');
      if (splashClose) splashClose.classList.add('visible');
    }, 500);

    guideTimer = setTimeout(() => {
      if (splashState === 'centered' && splashGuide) {
        splashGuide.classList.add('visible');
      }
    }, 2000);
  }

  if (journalTrigger) {
    journalTrigger.addEventListener('click', (e) => {
      e.stopPropagation();

      if (splashState === 'falling') {
        centerJournal();
      } else if (splashState === 'centered') {
        splashState = 'opened';
        if (splashItemInfo) splashItemInfo.classList.remove('visible');
        if (splashGuide) splashGuide.classList.remove('visible');
        if (splashClose) splashClose.classList.remove('visible');
        clearTimeout(infoTimer);
        clearTimeout(guideTimer);
        openJournal();
      }
    });
  }

  if (splashGuide) {
    splashGuide.addEventListener('click', (e) => {
      e.stopPropagation();
      if (splashState === 'centered') {
        splashState = 'opened';
        if (splashItemInfo) splashItemInfo.classList.remove('visible');
        if (splashGuide) splashGuide.classList.remove('visible');
        if (splashClose) splashClose.classList.remove('visible');
        clearTimeout(infoTimer);
        clearTimeout(guideTimer);
        openJournal();
      }
    });
  }

  if (cameraTrigger) {
    cameraTrigger.addEventListener('click', (e) => {
      const currentClientX = e.clientX;
      const currentClientY = e.clientY;
      const dist = Math.hypot(currentClientX - splashPhysics.startClientX, currentClientY - splashPhysics.startClientY);

      if (splashState === 'falling' && dist > 5) {
        e.preventDefault();
        return;
      }
      e.stopPropagation();

      // Trigger Flash
      cameraTrigger.classList.remove('flash-active');
      void cameraTrigger.offsetWidth; // trigger reflow
      cameraTrigger.classList.add('flash-active');

      // Play Sound
      audioEngine.play('capture');

      setTimeout(() => {
        cameraTrigger.classList.remove('flash-active');
      }, 300);
    });
  }

  if (boardgameTrigger) {
    boardgameTrigger.addEventListener('click', (e) => {
      const currentClientX = e.clientX;
      const currentClientY = e.clientY;
      const dist = Math.hypot(currentClientX - splashPhysics.startClientX, currentClientY - splashPhysics.startClientY);

      if (splashState === 'falling' && dist > 5) {
        e.preventDefault();
        return;
      }
      e.stopPropagation();

      boardgameTrigger.classList.remove('rolling');
      void boardgameTrigger.offsetWidth;
      boardgameTrigger.classList.add('rolling');

      audioEngine.play('thud', { type: 'dice_roll', impact: 10 });
      rollDie();

      setTimeout(() => {
        boardgameTrigger.classList.remove('rolling');
      }, 400);
    });
  }

  let isRolling = false;
  function rollDie() {
    if (isRolling) return;
    const dieFace = document.querySelector('.die-face');
    if (dieFace) {
      isRolling = true;
      let rolls = 0;
      const maxRolls = 5;
      const interval = setInterval(() => {
        const num = Math.floor(Math.random() * 6) + 1;
        dieFace.setAttribute('data-value', num);
        rolls++;
        if (rolls >= maxRolls) {
          clearInterval(interval);
          isRolling = false;
        }
      }, 80);
    }
  }


  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.addEventListener('click', (e) => {
      if (
        (lastMousedownTarget && (journalTrigger.contains(lastMousedownTarget) || (cameraTrigger && cameraTrigger.contains(lastMousedownTarget)))) ||
        (journalTrigger.contains(e.target) || (cameraTrigger && cameraTrigger.contains(e.target)))
      ) {
        return;
      }

      if (splashState === 'centered') {
        const clickedClose = splashClose && splashClose.contains(e.target);
        if (clickedClose || (!journalTrigger.contains(e.target) && (!splashItemInfo || !splashItemInfo.contains(e.target)))) {
          splashState = 'falling';
          audioEngine.play('transition');
          document.getElementById('splash-screen').classList.remove('focus-journal');

          if (splashItemInfo) splashItemInfo.classList.remove('visible');
          if (splashGuide) splashGuide.classList.remove('visible');
          if (splashClose) splashClose.classList.remove('visible');

          const splashPrompt = document.querySelector('.splash-prompt');
          if (splashPrompt) splashPrompt.style.opacity = '1';

          clearTimeout(infoTimer);
          clearTimeout(guideTimer);

          // Start book falling from current centered position
          const book = physicsItems.find(i => i.id === 'journal');
          if (book) {
            book.x = (window.innerWidth - 280) / 2;
            book.y = (window.innerHeight - 380) / 2;
            book.vy = -6; // gentle upward bounce
          }

          journalTrigger.style.transition = 'none';
          splashPhysics.start();
        }
      }
    });
  }

  const brandNav = document.getElementById('brand-nav');

  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (window.innerWidth <= 768) {
        if (brandNav) brandNav.classList.toggle('show');
      } else {
        if (document.body.classList.contains('journal-active')) {
          closeJournal();
        }
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && brandNav && brandNav.classList.contains('show')) {
      if (brandLogo && !brandLogo.contains(e.target) && !brandNav.contains(e.target)) {
        brandNav.classList.remove('show');
      }
    }
  });

  const navHome = document.getElementById('nav-home');
  const navPortfolio = document.getElementById('nav-portfolio');
  const navAbout = document.getElementById('nav-about');

  if (navHome) {
    navHome.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof closeJournal === 'function') closeJournal();
      if (brandNav) brandNav.classList.remove('show');
    });
  }

  function handleNavClick(categoryToOpen) {
    if (brandNav) brandNav.classList.remove('show');
    
    if (!document.body.classList.contains('journal-active')) {
      const trigger = document.getElementById('journal-trigger');
      
      let centerDelay = 0;
      // If it's somehow falling, trigger center
      if (typeof splashState !== 'undefined' && splashState === 'falling' && trigger) {
        if (typeof centerJournal === 'function') {
          centerJournal();
        } else {
          trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: splashPhysics ? splashPhysics.startClientX : 0, clientY: splashPhysics ? splashPhysics.startClientY : 0 }));
        }
        centerDelay = 1000;
      }
      
      setTimeout(() => {
        if (typeof splashState !== 'undefined') splashState = 'opened';
        if (typeof openJournal === 'function') openJournal();
        
        if (categoryToOpen) {
          setTimeout(() => {
            const tab = document.querySelector(`.divider-tab[data-category="${categoryToOpen}"]`);
            if (tab) tab.click();
          }, 1500);
        }
      }, centerDelay);
    } else {
      if (categoryToOpen) {
        const tab = document.querySelector(`.divider-tab[data-category="${categoryToOpen}"]`);
        if (tab) tab.click();
      }
    }
  }

  if (navPortfolio) {
    navPortfolio.addEventListener('click', (e) => {
      e.preventDefault();
      handleNavClick('nature');
    });
  }

  if (navAbout) {
    navAbout.addEventListener('click', (e) => {
      e.preventDefault();
      handleNavClick('about');
    });
  }

  // Close ribbon triggers
  const pageCloseRibbon = document.getElementById('page-close-ribbon');
  if (pageCloseRibbon) {
    pageCloseRibbon.addEventListener('click', closeJournal);
  }

  // Close when clicking background desk canvas
  if (canvasContainer) {
    canvasContainer.addEventListener('click', (e) => {
      if (e.target === canvasContainer) {
        closeJournal();
      }
    });
  }

  // ==========================================================================
  // NOTEBOOK CONTENT GENERATION & LAYOUTS — Gallery module
  // ==========================================================================


  const gallery = new Gallery({
    data: (typeof galleryData !== 'undefined') ? galleryData : [],
    onOpenDetails: (item) => openDetailsModal(item),
    setActiveClickedImg: (img) => { activeClickedImg = img; }
  });

  const ticketSlider = new TicketSlider({
    data: (typeof galleryData !== 'undefined') ? galleryData : [],
    onOpenDetails: (item) => openDetailsModal(item),
    setActiveClickedImg: (img) => { activeClickedImg = img; }
  });

  const domAdapter = new NotebookDOMAdapter();

  // ==========================================================================
  // NOTEBOOK ROUTER — category navigation module
  // ==========================================================================


  const dividerTabs = document.querySelectorAll('.divider-tab, .top-tab');

  // Bind tab click events via the router
  dividerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category');
      router.navigate(cat);
    });
  });

  // ==========================================================================
  // DETAIL CINEMA OVERLAY MODAL
  // ==========================================================================

  function formatEmbedUrl(url) {
    if (!url) return '';

    // YouTube embeds
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
      } else if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('/embed/')) {
        return url;
      }
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    }

    // Google Drive video preview links
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    return url;
  }

  function openDetailsModal(data) {
    if (!detailsMediaContainer) return;
    lastActiveElement = document.activeElement;
    detailsMediaContainer.innerHTML = '';

    let mediaEl = null;

    if (data.type === 'video') {
      if (data.videoSrc) {
        // Local direct WebM video asset
        const video = document.createElement('video');
        video.src = data.videoSrc;
        video.controls = true;
        video.autoplay = false;
        video.playsInline = true;
        mediaEl = video;
      } else if (data.videoUrl) {
        // External YouTube or Google Drive stream
        const embedUrl = formatEmbedUrl(data.videoUrl);
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        mediaEl = iframe;
      }

      detailsModal.classList.add('video-modal');

      const gearRow = document.getElementById('meta-gear-row');
      if (gearRow) {
        gearRow.style.display = data.gear ? 'flex' : 'none';
      }
    } else {
      // Image details view
      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.title || '';
      mediaEl = img;

      const gearRow = document.getElementById('meta-gear-row');
      if (gearRow) {
        gearRow.style.display = 'flex';
      }

      detailsModal.classList.remove('video-modal');
    }

    if (activeClickedImg) activeClickedImg.style.viewTransitionName = 'active-media';

    const transition = runViewTransition(() => {
      if (activeClickedImg) {
        activeClickedImg.style.viewTransitionName = '';
        activeClickedImg.classList.remove('animating-to-center');
        activeClickedImg.style.removeProperty('--center-dx');
        activeClickedImg.style.removeProperty('--center-dy');

        if (activeClickedImg.parentNode === document.body) {
          activeClickedImg.remove();
        }
      }
      if (mediaEl) {
        mediaEl.style.viewTransitionName = 'active-media';
        detailsMediaContainer.appendChild(mediaEl);
      }

      // Populate descriptor labels
      if (detailsCategory) {
        detailsCategory.textContent = data.category;
        detailsCategory.style.color = `var(--color-${data.category})`;
      }

      if (detailsTitle) {
        if (data.title) {
          detailsTitle.textContent = data.title;
          detailsTitle.style.display = 'block';
        } else {
          detailsTitle.style.display = 'none';
        }
      }

      if (detailsDescription) {
        detailsDescription.innerHTML = data.description || '';
      }
      if (detailsRole) {
        detailsRole.textContent = data.roles || 'Photographer';
      }
      if (detailsGear) {
        detailsGear.innerHTML = data.gear || 'Canon EOS Rebel T7';
      }

      if (detailsModal) {
        detailsModal.classList.add('is-open');
        detailsModal.setAttribute('aria-hidden', 'false');
        if (closeDetails) {
          setTimeout(() => closeDetails.focus(), 80);
        }
      }
    });

    const cleanUp = () => {
      if (activeClickedImg) activeClickedImg.style.viewTransitionName = '';
      if (mediaEl) mediaEl.style.viewTransitionName = '';
    };
    if (transition.finished) {
      transition.finished.then(cleanUp).catch(cleanUp);
    } else {
      cleanUp();
    }
  }

  function closeDetailsModal() {
    const mediaEl = detailsMediaContainer.firstElementChild;
    if (mediaEl) mediaEl.style.viewTransitionName = 'active-media';

    const transition = runViewTransition(() => {
      if (mediaEl) mediaEl.style.viewTransitionName = '';
      if (activeClickedImg) activeClickedImg.style.viewTransitionName = 'active-media';

      if (detailsModal) {
        detailsModal.classList.remove('is-open');
        detailsModal.setAttribute('aria-hidden', 'true');
        if (lastActiveElement) {
          setTimeout(() => lastActiveElement.focus(), 80);
        }
      }
    });

    const cleanUp = () => {
      if (detailsMediaContainer) {
        detailsMediaContainer.innerHTML = '';
      }
      if (activeClickedImg) activeClickedImg.style.viewTransitionName = '';
      activeClickedImg = null;
    };
    if (transition.finished) {
      transition.finished.then(cleanUp).catch(cleanUp);
    } else {
      cleanUp();
    }
  }



  if (detailsModal) {
    const backdrop = detailsModal.querySelector('.modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeDetailsModal);
  }



  if (closeDetails) closeDetails.addEventListener('click', closeDetailsModal);

  // Global Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    // Trap focus inside details modal when open
    if (detailsModal && detailsModal.classList.contains('is-open')) {
      if (e.key === 'Tab') {
        const focusable = detailsModal.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      }
    }

    // Escape closes modal or journal
    if (e.key === 'Escape') {
      if (detailsModal && detailsModal.classList.contains('is-open')) {
        closeDetailsModal();
      } else if (document.body.classList.contains('journal-active')) {
        closeJournal();
      }
    }

    // Arrow keys and Number keys for navigation
    if (!detailsModal || !detailsModal.classList.contains('is-open')) {
      if (document.body.classList.contains('journal-active')) {
        if (e.key === 'ArrowRight') {
          if (gallery.category === 'videos') {
            const nextBtn = document.getElementById('ticket-slider-next');
            if (nextBtn) nextBtn.click();
          }
        } else if (e.key === 'ArrowLeft') {
          if (gallery.category === 'videos') {
            const prevBtn = document.getElementById('ticket-slider-prev');
            if (prevBtn) prevBtn.click();
          }
        } else if (e.key === '1') {
          router.navigate('about');
        } else if (e.key === '2') {
          router.navigate('videos');
        } else if (e.key === '3') {
          router.navigate('photowalk');
        } else if (e.key === '4') {
          router.navigate('people');
        } else if (e.key === '5') {
          router.navigate('nature');
        }
      }
    }
  });



  // ==========================================================================
  // THEME SWITCH (LIGHT/DARK)
  // ==========================================================================

  const savedTheme = localStorage.getItem('theme') || 'light-mode';
  document.body.classList.remove('light-mode', 'dark-mode');
  document.body.classList.add(savedTheme);
  updateThemeIcon(savedTheme);

  if (btnTheme) {
    btnTheme.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isDark = document.body.classList.contains('dark-mode');
      const newTheme = isDark ? 'light-mode' : 'dark-mode';

      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!btnTheme) return;
    const icon = btnTheme.querySelector('i');
    if (!icon) return;

    if (theme === 'dark-mode') {
      icon.className = 'fa-regular fa-sun';
    } else {
      icon.className = 'fa-regular fa-moon';
    }
  }

  // About Page flip logic
  const notebook = document.querySelector('.notebook');

  function doPageFlip(direction, onMidpoint) {
    if (document.querySelector('.flipping-page-container')) return false; // already flipping
    audioEngine.play('flip');

    const container = document.createElement('div');
    container.className = `flipping-page-container ${direction === 'next' ? 'flip-next' : 'flip-prev'}`;

    const faceFront = document.createElement('div');
    faceFront.className = 'flip-face flip-face-front';

    const faceBack = document.createElement('div');
    faceBack.className = 'flip-face flip-face-back';

    container.appendChild(faceFront);
    container.appendChild(faceBack);
    notebook.appendChild(container);

    // At midpoint (page fully perpendicular), swap the underlying content
    setTimeout(() => {
      if (typeof onMidpoint === 'function') {
        onMidpoint();
      } else {
        // Default: About Me toggle
        if (direction === 'next') {
          notebook.classList.add('show-about');
          document.getElementById('notebook-container').classList.add('show-about-container');
        } else {
          notebook.classList.remove('show-about');
          document.getElementById('notebook-container').classList.remove('show-about-container');
        }
      }
    }, 500);

    // Clean up overlay
    setTimeout(() => {
      container.remove();
    }, 1000);

    return true;
  }

  // Wire the router now that all dependencies are defined
  const router = new NotebookRouter({
    gallery,
    ticketSlider,
    domAdapter,
    audioEngine,
    runViewTransition,
    doPageFlip
  });

  // ==========================================================================
  // SKILLS SLIDER LOGIC
  // ==========================================================================
  const skillPrevBtn = document.querySelector('.skill-slider-prev');
  const skillNextBtn = document.querySelector('.skill-slider-next');
  const skillsTrack = document.querySelector('.skills-track');

  if (skillPrevBtn && skillNextBtn && skillsTrack) {
    let isAnimating = false;
    const trackWrapper = skillsTrack.parentElement;

    function updateActive() {
      const items = skillsTrack.querySelectorAll('.skill-item');
      if (items.length === 0) return;

      items.forEach((item, index) => {
        if (index === 2) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      if (items.length === 0) return;

      // BATCH READS
      const itemWidth = items[0].offsetWidth;
      const trackWidth = trackWrapper.offsetWidth;
      const gap = 15;
      const centerOffset = (trackWidth - itemWidth) / 2;
      const translateX = -(2 * (itemWidth + gap)) + centerOffset;

      // BATCH WRITES
      skillsTrack.style.transition = 'none';
      skillsTrack.style.transform = `translateX(${translateX}px)`;
      // force reflow
      void skillsTrack.offsetHeight;
      skillsTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    }

    skillNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isAnimating) return;
      isAnimating = true;

      const items = skillsTrack.querySelectorAll('.skill-item');
      if (items.length === 0) return;

      // BATCH READS
      const itemWidth = items[0].offsetWidth;
      const trackWidth = trackWrapper.offsetWidth;
      const gap = 15;
      const centerOffset = (trackWidth - itemWidth) / 2;

      // Move to index 3
      const translateX = -(3 * (itemWidth + gap)) + centerOffset;

      items[2].classList.remove('active');
      items[3].classList.add('active');

      skillsTrack.style.transform = `translateX(${translateX}px)`;

      setTimeout(() => {
        skillsTrack.style.transition = 'none';
        skillsTrack.appendChild(skillsTrack.firstElementChild); // wrap around
        const resetTranslate = -(2 * (itemWidth + gap)) + centerOffset;
        skillsTrack.style.transform = `translateX(${resetTranslate}px)`;
        skillsTrack.offsetHeight; // force reflow
        skillsTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        isAnimating = false;
      }, 400);
    });

    skillPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isAnimating) return;
      isAnimating = true;

      const items = skillsTrack.querySelectorAll('.skill-item');
      if (items.length === 0) return;

      // BATCH READS
      const itemWidth = items[0].offsetWidth;
      const trackWidth = trackWrapper.offsetWidth;
      const gap = 15;
      const centerOffset = (trackWidth - itemWidth) / 2;

      // Move to index 1
      const translateX = -(1 * (itemWidth + gap)) + centerOffset;

      items[2].classList.remove('active');
      items[1].classList.add('active');

      skillsTrack.style.transform = `translateX(${translateX}px)`;

      setTimeout(() => {
        skillsTrack.style.transition = 'none';
        skillsTrack.insertBefore(skillsTrack.lastElementChild, skillsTrack.firstElementChild); // wrap around
        const resetTranslate = -(2 * (itemWidth + gap)) + centerOffset;
        skillsTrack.style.transform = `translateX(${resetTranslate}px)`;
        void skillsTrack.offsetHeight; // force reflow
        skillsTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        isAnimating = false;
      }, 400);
    });

    // Fix for slider initialization when the About page is first opened
    const notebookEl = document.querySelector('.notebook');
    if (notebookEl) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class' && notebookEl.classList.contains('show-about')) {
            setTimeout(updateActive, 50);
          }
        });
      });
      observer.observe(notebookEl, { attributes: true });
    }

    // Initial call
    setTimeout(updateActive, 50);
  }

  // macOS Dock App Opening Logic
  // Wired via event delegation instead of inline onclick handlers
  function openApp(imgSrc, appName) {
    const display = document.getElementById('activeAppDisplay');
    const icon = document.getElementById('activeAppIcon');
    const name = document.getElementById('activeAppName');

    if (!display || !icon || !name) return;

    // Reset display
    display.classList.remove('visible');

    setTimeout(() => {
      icon.src = imgSrc;
      name.textContent = appName;
      display.classList.add('visible');

      audioEngine.play('appOpen');
    }, 200);
  }

  // Delegate dock clicks instead of relying on inline onclick + window.openApp
  const macDock = document.querySelector('.mac-dock');
  if (macDock) {
    macDock.addEventListener('click', (e) => {
      const dockItem = e.target.closest('.dock-item');
      if (!dockItem) return;
      const img = dockItem.querySelector('img');
      if (!img) return;
      openApp(img.src, img.alt);
    });
  }

});

// macOS Live Time Logic (Pacific Time)
function updateMacTime() {
  const timeEl = document.getElementById('macTime');
  if (!timeEl) return;

  // Format as "Mon 10:00 AM" using Pacific Time
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Intl format output is like "Mon, 10:00 AM", we remove the comma
  timeEl.textContent = formatter.format(new Date()).replace(',', '');
}

// Start time immediately and update every minute
updateMacTime();
setInterval(updateMacTime, 60000);

// Laptop Drag Interaction
(function () {
  const frame = document.querySelector('.laptop-frame');
  if (!frame) return;

  let isDragging = false;
  let startX = 0, startY = 0;
  let currentX = 0, currentY = 0;

  function setTransform(dx, dy) {
    frame.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  frame.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    frame.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    setTransform(currentX, currentY, true);
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    currentX = 0;
    currentY = 0;
    frame.classList.remove('dragging');
    // Spring back — must yield a frame so the transition re-enables before the value changes
    requestAnimationFrame(() => setTransform(0, 0));
  });

  // Touch support
  frame.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    isDragging = true;
    startX = t.clientX - currentX;
    startY = t.clientY - currentY;
    frame.classList.add('dragging');
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const t = e.touches[0];
    currentX = t.clientX - startX;
    currentY = t.clientY - startY;
    setTransform(currentX, currentY, true);
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    currentX = 0;
    currentY = 0;
    frame.classList.remove('dragging');
    requestAnimationFrame(() => setTransform(0, 0));
  });
})();
// Mobile Photo Slider Logic
document.addEventListener('DOMContentLoaded', () => {
  const photoTrack = document.getElementById('photos-track-wrapper');
  const photoPrev = document.getElementById('photo-slider-prev');
  const photoNext = document.getElementById('photo-slider-next');

  if (photoTrack && photoPrev && photoNext) {
    const updatePhotoArrows = () => {
      photoTrack.style.setProperty('--col-width', `${photoTrack.clientWidth}px`);
      const scrollLeft = photoTrack.scrollLeft;
      const maxScroll = photoTrack.scrollWidth - photoTrack.clientWidth;
      photoPrev.disabled = scrollLeft <= 5;
      photoNext.disabled = scrollLeft >= maxScroll - 5;
    };

    photoTrack.addEventListener('scroll', updatePhotoArrows);
    window.addEventListener('resize', updatePhotoArrows);

    photoPrev.addEventListener('click', () => {
      // 220px photo + 16px gap
      const colWidth = window.innerWidth <= 900 ? 236 : photoTrack.clientWidth + 16;
      const currentCol = Math.round(photoTrack.scrollLeft / colWidth);
      const targetLeft = Math.max(0, (currentCol - 1) * colWidth);
      photoTrack.scrollTo({ left: targetLeft, behavior: 'smooth' });
    });

    photoNext.addEventListener('click', () => {
      // 220px photo + 16px gap
      const colWidth = window.innerWidth <= 900 ? 236 : photoTrack.clientWidth + 16;
      const currentCol = Math.round(photoTrack.scrollLeft / colWidth);
      const targetLeft = (currentCol + 1) * colWidth;
      photoTrack.scrollTo({ left: targetLeft, behavior: 'smooth' });
    });

    const observer = new MutationObserver(() => {
      setTimeout(updatePhotoArrows, 100);
    });

    const photosGrid = document.getElementById('photos-grid');
    if (photosGrid) {
      observer.observe(photosGrid, { childList: true });
    }
  }
});