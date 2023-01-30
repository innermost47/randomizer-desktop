import { audioCtx } from "../utils/utils.js";
import { AbstractSynth } from "./AbstractSynth.js";

export class MonoSynth extends AbstractSynth {
  constructor() {
    super();
    this.className = "mono";
    this.greatName = "Mono Synth";
  }

  play(frequency, duration, velocity) {
    this.createLfos();
    this.oscillator = audioCtx.createOscillator();
    this.oscillator2 = audioCtx.createOscillator();
    this.synthGain = audioCtx.createGain();
    this.filter = audioCtx.createBiquadFilter();
    this.filter.type = this.filterType;
    this.filter.Q.value = this.resonnance;
    this.oscillator.type = this.waveForm;
    this.oscillator2.type = this.waveForm;
    this.filter.frequency.value = 0;
    this.synthGain.gain.value = 0;

    this.addEnveloppes(this.filter, this.synthGain, duration, velocity);

    this.filterModulation.connect(this.filter.frequency);
    this.pitchModulation.connect(this.oscillator.frequency);
    this.pitchModulation.connect(this.oscillator2.frequency);

    this.oscillator2.connect(this.synthGain);
    this.oscillator.connect(this.synthGain);
    this.synthGain.connect(this.filter);
    this.filter.connect(this.gain);

    this.filterModulation.start(audioCtx.currentTime);
    this.pitchModulation.start(audioCtx.currentTime);
    this.oscillator.frequency.value = frequency * this.pitch + this.detune;
    this.oscillator.start(audioCtx.currentTime);
    this.oscillator2.frequency.value = frequency * this.pitch - this.detune;
    this.oscillator2.start(audioCtx.currentTime);
    this.stop(
      duration,
      this.oscillator,
      this.synthGain,
      this.filter,
      this.oscillator2
    );
  }

  stop(duration, oscillator, synthGain, filter, oscillator2) {
    oscillator.stop(audioCtx.currentTime + duration / 1000);
    oscillator2.stop(audioCtx.currentTime + duration / 1000);
    this.stopLfos(duration);
    setTimeout(() => {
      this.disconnect(oscillator, synthGain, filter, oscillator2);
    }, duration);
  }

  disconnect(oscillator, synthGain, filter, oscillator2) {
    synthGain.disconnect();
    filter.disconnect();
    oscillator.disconnect();
    oscillator2.disconnect();
  }
}
