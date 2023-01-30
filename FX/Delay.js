import { time } from "../script.js";
import { audioCtx } from "../utils/utils.js";

export class Delay {
  constructor() {
    this.delay = audioCtx.createDelay();
    this.feedback = audioCtx.createGain();
    this.feedback.gain.value = 0;
    this.delay.delayTime.value = (time.stepTime / 1000) * 2;
  }

  connect(audioSource, audioDestination) {
    audioSource.connect(this.delay);
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
    this.delay.connect(audioDestination);
  }

  disconnect() {
    this.delay.disconnect();
    this.feedback.disconnect();
  }
}
