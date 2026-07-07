export default class AudioEngine {
  constructor(strategies = {}) {
    this.isMuted = localStorage.getItem('portfolio-muted') !== 'false';
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
      this.ctx.masterGain = this.ctx.createGain();
      this.ctx.masterGain.gain.value = 0.3; // Lower overall volume
      this.ctx.masterGain.connect(this.ctx.destination);
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
