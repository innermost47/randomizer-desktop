import { audioCtx } from "../utils/utils.js";

export class Distorsion {
  constructor() {
    this.distorsion = audioCtx.createWaveShaper();
    this.distorsionGain = audioCtx.createGain();
    this.distorsion.oversample = "4x";
    this.distorsionGain.gain.value = 0.3;
    this.setAmount(0);
  }

  setAmount(amount) {
    let n_samples = 44100,
      curve = new Float32Array(n_samples),
      threshold = 1 - amount;
    for (let i = 0; i < n_samples; ++i) {
      let x = (i * 2) / n_samples - 1;
      if (x < -threshold) {
        curve[i] = -1;
      } else if (x > threshold) {
        curve[i] = 1;
      } else {
        curve[i] = x;
      }
    }
    this.distorsion.curve = curve;
  }

  connect(audioSource, audioDestination) {
    audioSource.connect(this.distorsion);
    this.distorsion.connect(this.distorsionGain);
    this.distorsionGain.connect(audioDestination);
  }

  disconnect() {
    this.distorsion.disconnect();
    this.distorsionGain.disconnect();
  }
}
