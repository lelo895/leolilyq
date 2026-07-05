export function playConfirmBeep(ctx, t) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, t);
  gain.gain.setValueAtTime(0.02, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(t + 0.1);
}

export function playFlip(ctx, t) {
  const bufferSize = ctx.sampleRate * 0.25;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(600, t);
  filter.Q.setValueAtTime(1.5, t);
  filter.frequency.exponentialRampToValueAtTime(150, t + 0.2);
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.05, t);
  gainNode.gain.linearRampToValueAtTime(0.4, t + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.25);
}

export function playCapture(ctx, t) {
  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, t);
  filter.Q.setValueAtTime(0.8, t);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.2, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.1);
}

export function playThud(ctx, t, options = {}) {
  const type = options.type || 'journal';
  const impact = options.impact || 5;
  const vol = Math.min(impact * 0.015, 0.15);

  if (type === 'journal' || type === 'boardgame') {
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, t);
    const gain = ctx.createGain();
    const baseVol = type === 'boardgame' ? 0.8 : 2.5;
    gain.gain.setValueAtTime(vol * baseVol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.1);
  } else if (type === 'mahjong') {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  } else if (type === 'birdie') {
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, t);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 1.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  } else if (type === 'dice_roll') {
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, t);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.15);
  } else if (type === 'tennis') {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.05);
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(800, t);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 1.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
    noise.start(t);
    noise.stop(t + 0.05);
  } else {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.1);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }
}

export function playTransition(ctx, t) {
  const bufferSize = ctx.sampleRate * 0.8;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(100, t);
  filter.frequency.exponentialRampToValueAtTime(800, t + 0.4);
  filter.frequency.exponentialRampToValueAtTime(100, t + 0.8);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.05, t + 0.4);
  gain.gain.linearRampToValueAtTime(0, t + 0.8);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.8);
}

export function playBirdieFall(ctx, t) {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(50, t + 0.4);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.03, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.4);
}

export function playAppOpen(ctx, t) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.05, t + 0.05);
  gain.gain.linearRampToValueAtTime(0, t + 0.1);
  osc.start(t);
  osc.stop(t + 0.1);
}

export const defaultStrategies = {
  confirmBeep: playConfirmBeep,
  flip: playFlip,
  capture: playCapture,
  thud: playThud,
  transition: playTransition,
  birdieFall: playBirdieFall,
  appOpen: playAppOpen
};
