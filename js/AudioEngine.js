export default class AudioEngine {
  constructor(strategies = {}) {
    this.isMuted = localStorage.getItem('portfolio-muted') === 'true';
    this.ctx = null;
    this.strategies = strategies;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('portfolio-muted', this.isMuted);
    if (!this.isMuted) this.play('confirmBeep');
    return this.isMuted;
  }

  initCtx() {
    if (this.ctx) return this.ctx;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    try {
      this.ctx = new AudioContext();
    } catch (e) { }
    return this.ctx;
  }

  play(effectName, options = {}) {
    if (this.isMuted) return;
    if (effectName === 'flip' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') ctx.resume();
      const t = ctx.currentTime;

      const strategy = this.strategies[effectName];
      if (strategy) {
        strategy(ctx, t, options);
      }
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  }
}
