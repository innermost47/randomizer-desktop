export const audioCtx = new (window.AudioContext ||
  window.webkitAudioContext)();

export function pickRandomProperty(obj) {
  let result;
  let count = 0;
  for (let prop in obj) if (Math.random() < 1 / ++count) result = prop;
  return result;
}

export const waveShapes = {
  SINE: "sine",
  SQUARE: "square",
  SAW: "sawtooth",
  TRI: "triangle",
};

export const filterTypes = {
  LPF: "lowpass",
  HPF: "highpass",
  BPF: "bandpass",
};

export const volumes = {
  master: audioCtx.createGain(),
};

export function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}
