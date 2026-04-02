let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

/** Short cheerful "bloop" for starting a paint stroke */
export function playPaintStart() {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(500, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ac.currentTime + 0.08);
  gain.gain.setValueAtTime(0.15, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.1);
}

/** Bubbly splash sound for flood fill */
export function playFill() {
  const ac = getCtx();
  const t = ac.currentTime;

  for (let i = 0; i < 4; i++) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type = 'sine';
    const freq = 400 + Math.random() * 400;
    osc.frequency.setValueAtTime(freq, t + i * 0.05);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + i * 0.05 + 0.12);
    gain.gain.setValueAtTime(0.12, t + i * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.12);

    osc.start(t + i * 0.05);
    osc.stop(t + i * 0.05 + 0.12);
  }
}

/** Bouncy "boing" for placing a stamp */
export function playStamp() {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(250, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(400, ac.currentTime + 0.15);
  gain.gain.setValueAtTime(0.18, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.2);
}

/** Swooshy clear sound */
export function playClear() {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ac.currentTime + 0.3);
  gain.gain.setValueAtTime(0.08, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.3);
}

/** Quick pop for selecting a color */
export function playColorPick() {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ac.currentTime + 0.05);
  gain.gain.setValueAtTime(0.12, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.07);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.07);
}
