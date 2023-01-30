import { audioCtx } from "../utils/utils.js";
import { AbstractSynth } from "./AbstractSynth.js";

export class PolySynth extends AbstractSynth {
  constructor() {
    super();
    this.className = "poly";
    this.greatName = "Poly Synth";
  }

  play(frequencies, duration, velocity) {
    this.createLfos();
    this.synthGain = audioCtx.createGain();
    this.oscillators = [];
    this.oscillators2 = [];
    for (let i = 0; i < frequencies.length; i++) {
      this.oscillators[i] = audioCtx.createOscillator();
      this.oscillators[i].type = this.waveForm;
      this.oscillators[i].connect(this.synthGain);
    }
    for (let i = 0; i < frequencies.length; i++) {
      this.oscillators2[i] = audioCtx.createOscillator();
      this.oscillators2[i].type = this.waveForm;
      this.oscillators2[i].connect(this.synthGain);
    }

    this.filter = audioCtx.createBiquadFilter();
    this.filter.type = this.filterType;
    this.filter.Q.value = this.resonnance;
    this.filter.frequency.value = 0;
    this.synthGain.gain.value = 0;

    this.addEnveloppes(this.filter, this.synthGain, duration, velocity);

    this.filterModulation.connect(this.filter.frequency);

    this.synthGain.connect(this.filter);
    this.filter.connect(this.gain);

    this.filterModulation.start(audioCtx.currentTime);
    this.pitchModulation.start(audioCtx.currentTime);

    for (let i = 0; i < this.oscillators.length; i++) {
      this.oscillators[i].frequency.value =
        frequencies[i] * this.pitch + this.detune;
      this.pitchModulation.connect(this.oscillators[i].frequency);
      this.oscillators[i].start(audioCtx.currentTime);
    }
    for (let i = 0; i < this.oscillators2.length; i++) {
      this.oscillators2[i].frequency.value =
        frequencies[i] * this.pitch - this.detune;
      this.pitchModulation.connect(this.oscillators2[i].frequency);
      this.oscillators2[i].start(audioCtx.currentTime);
    }

    this.stop(
      duration,
      this.oscillators,
      this.synthGain,
      this.filter,
      this.oscillators2
    );
  }

  stop(duration, oscillators, synthGain, filter, oscillators2) {
    for (let i = 0; i < oscillators.length; i++) {
      oscillators[i].stop(audioCtx.currentTime + duration / 1000);
    }
    for (let i = 0; i < oscillators.length; i++) {
      oscillators2[i].stop(audioCtx.currentTime + duration / 1000);
    }
    this.stopLfos(duration);
    setTimeout(() => {
      this.disconnect(oscillators, synthGain, filter, oscillators2);
    }, duration);
  }

  disconnect(oscillators, synthGain, filter, oscillators2) {
    for (let i = 0; i < oscillators.length; i++) {
      oscillators[i].disconnect();
    }
    for (let i = 0; i < oscillators.length; i++) {
      oscillators2[i].disconnect();
    }
    synthGain.disconnect();
    filter.disconnect();
  }
}
