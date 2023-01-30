import { audioCtx, filterTypes, waveShapes } from "../utils/utils.js";
import { Enveloppe } from "./Enveloppe.js";
import { Lfo } from "./Lfo.js";
import { MelodicInstrument } from "./MelodicInstrument.js";

export class AbstractSynth extends MelodicInstrument {
  static instanceCount = 0;
  constructor() {
    super();
    this.id = `synth-${++AbstractSynth.instanceCount}-`;
    this.filterEnveloppe = new Enveloppe();
    this.volumeEnveloppe = new Enveloppe();
    this.pitchModulation = new Lfo();
    this.filterModulation = new Lfo();
    this.filterEnveloppe.decayValue = 0;
    this.volumeEnveloppe.attackTime = 0;
    this.volumeEnveloppe.attackValue = 0.7;
    this.volumeEnveloppe.decayTime = 0.8;
    this.volumeEnveloppe.decayValue = 0;
    this.filterEnveloppe.attackTime = 0;
    this.filterEnveloppe.decayTime = 1.5;
    this.cutoff = 5000;
    this.filterType = filterTypes.LPF;
    this.resonnance = 0;
    this.waveForm = waveShapes.SINE;
    this.pitch = 1;
    this.className = "";
    this.volume = 0.8;
    this.detune = 0;
    this.greatName = "";
  }
  createHtml(parentHTML) {
    if (parentHTML != null) {
      this.block = document.createElement("div");
      this.block.classList.add("synth", this.className);

      this.controlContainer = document.createElement("div");
      this.controlContainer.className = "control-container";

      this.pitchBlock = document.createElement("div");
      this.pitchBlock.className = "synth-controls";

      this.filterBlock = document.createElement("div");
      this.filterBlock.className = "synth-controls";

      this.volumeBlock = document.createElement("div");
      this.volumeBlock.className = "synth-controls";

      this.lfoBlock = document.createElement("div");
      this.lfoBlock.className = "synth-controls";

      this.fxBlock = document.createElement("div");
      this.fxBlock.className = "synth-controls";

      this.randomBlock = document.createElement("div");
      this.randomBlock.className = "synth-controls";

      this.instrumentName = document.createElement("h2");
      this.instrumentName.innerHTML = this.greatName;
      this.instrumentSubtitle = document.createElement("h3");
      this.instrumentSubtitle.innerHTML = this.name;

      this.waveFormSelector = this.createWaveformSelector();
      this.filterSelector = this.createFilterTypeSelector();

      this.pitchBlock.appendChild(
        this.createTypeRange(0, 1, "Volume", 0.01, this.volume, "volume")
      );
      this.pitchBlock.appendChild(
        this.createTypeRange(0, 10, "Detune", 0.01, this.detune, "detune")
      );
      this.pitchBlock.appendChild(
        this.createTypeRange(0.5, 2, "Pitch", 0.01, this.pitch, "pitch")
      );
      this.filterBlock.appendChild(
        this.createTypeRange(0, 22050, "Cutoff", 1, this.cutoff, "cutoff")
      );
      this.filterBlock.appendChild(
        this.createTypeRange(
          0,
          40,
          "Resonnance",
          0.1,
          this.resonnance,
          "resonnance"
        )
      );
      this.filterBlock.appendChild(
        this.createTypeRange(
          0,
          0.5,
          "Filter Attack",
          0.001,
          this.filterEnveloppe.attackTime,
          "filter-attack"
        )
      );
      this.filterBlock.appendChild(
        this.createTypeRange(
          0,
          2,
          "Filter Decay",
          0.01,
          this.filterEnveloppe.decayTime,
          "filter-decay"
        )
      );
      this.volumeBlock.appendChild(
        this.createTypeRange(
          0,
          0.5,
          "Volume Attack",
          0.01,
          this.volumeEnveloppe.attackTime,
          "volume-attack"
        )
      );
      this.volumeBlock.appendChild(
        this.createTypeRange(
          0,
          4,
          "Volume Decay",
          0.01,
          this.volumeEnveloppe.decayTime,
          "volume-decay"
        )
      );
      this.lfoBlock.appendChild(
        this.createTypeRange(
          0,
          10,
          "Pitch LFO Speed",
          0.01,
          this.pitchModulation.frequency,
          "pitch-lfo-speed"
        )
      );
      this.lfoBlock.appendChild(
        this.createTypeRange(
          0,
          1000,
          "Pitch LFO Amount",
          0.01,
          this.pitchModulation.amplitude,
          "pitch-lfo-amount"
        )
      );
      this.lfoBlock.appendChild(
        this.createTypeRange(
          0,
          10,
          "Filter LFO Speed",
          0.01,
          this.filterModulation.frequency,
          "filter-lfo-speed"
        )
      );
      this.lfoBlock.appendChild(
        this.createTypeRange(
          0,
          4000,
          "Filter LFO Amount",
          0.01,
          this.filterModulation.amplitude,
          "filter-lfo-amount"
        )
      );
      this.fxBlock.appendChild(
        this.createTypeRange(0, 1, "Distorsion Amount", 0.01, 0, "distorsion")
      );
      this.fxBlock.appendChild(
        this.createTypeRange(
          0,
          1,
          "Delay Amount",
          0.01,
          this.delay.feedback.gain.value,
          "delay"
        )
      );
      this.fxBlock.appendChild(
        this.createTypeRange(
          0,
          1,
          "Reverb Amount",
          0.01,
          this.reverb.reverbGain.gain.value,
          "reverb"
        )
      );
      this.randomBlock.appendChild(
        this.createTypeRange(
          0,
          1,
          "Random Value",
          0.01,
          this.randomValue,
          "random-value"
        )
      );
      this.block.appendChild(this.instrumentName);
      this.block.appendChild(this.instrumentSubtitle);
      this.block.appendChild(this.waveFormSelector);
      this.block.appendChild(this.filterSelector);
      this.controlContainer.appendChild(this.pitchBlock);
      this.controlContainer.appendChild(this.filterBlock);
      this.controlContainer.appendChild(this.volumeBlock);
      this.controlContainer.appendChild(this.lfoBlock);
      this.controlContainer.appendChild(this.fxBlock);
      this.controlContainer.appendChild(this.randomBlock);
      this.block.appendChild(this.controlContainer);
      parentHTML.appendChild(this.block);
    }
  }

  createTypeRange(min, max, labelHTML, step, value, id) {
    let container = document.createElement("div");
    container.className = "synths-faders";
    let fader = document.createElement("input");
    fader.type = "range";
    fader.min = min;
    fader.max = max;
    fader.step = step;
    fader.value = value;
    fader.className = "instrument-fader";
    fader.id = this.id + id;
    let label = document.createElement("label");
    label.innerHTML = labelHTML;
    label.className = "instrument-fader-label";
    container.appendChild(fader);
    container.appendChild(label);
    return container;
  }

  createWaveformSelector() {
    let container = document.createElement("div");
    container.className = "waveform-selector";

    let sineOption = this.createOption("Sine", "sine");
    let squareOption = this.createOption("Square", "square");
    let sawtoothOption = this.createOption("Saw", "sawtooth");
    let triangleOption = this.createOption("Tri", "triangle");

    let selector = document.createElement("select");
    selector.id = this.id + "waveform";
    selector.appendChild(sineOption);
    selector.appendChild(squareOption);
    selector.appendChild(sawtoothOption);
    selector.appendChild(triangleOption);
    if (this.waveForm === "sine") {
      sineOption.selected = true;
    } else if (this.waveForm === "square") {
      squareOption.selected = true;
    } else if (this.waveForm === "sawtooth") {
      sawtoothOption.selected = true;
    } else if (this.waveForm === "triangle") {
      triangleOption.selected = true;
    }
    let label = document.createElement("label");
    label.innerHTML = "Osc";
    label.className = "instrument-fader-label";
    container.appendChild(label);
    container.appendChild(selector);
    return container;
  }

  createFilterTypeSelector() {
    let container = document.createElement("div");
    container.className = "filter-type-selector";

    let hpfOption = this.createOption("HPF", filterTypes.HPF);
    let lpfOption = this.createOption("LPF", filterTypes.LPF);
    let bpfOption = this.createOption("BPF", filterTypes.BPF);

    let selector = document.createElement("select");
    selector.id = this.id + "filter";
    selector.appendChild(hpfOption);
    selector.appendChild(lpfOption);
    selector.appendChild(bpfOption);
    if (this.filterType === filterTypes.LPF) {
      lpfOption.selected = true;
    } else if (this.filterType === filterTypes.HPF) {
      hpfOption.selected = true;
    } else if (this.filterType === filterTypes.BPF) {
      bpfOption.selected = true;
    }

    let label = document.createElement("label");
    label.innerHTML = "Filter";
    label.className = "instrument-fader-label";
    container.appendChild(label);
    container.appendChild(selector);
    return container;
  }

  createOption(label, value) {
    let option = document.createElement("option");
    option.textContent = label;
    option.value = value;
    return option;
  }

  addEventsListeners() {
    const volume = document.getElementById(this.id + "volume");
    volume.addEventListener("input", (e) => {
      this.volume = e.target.value;
    });
    const detune = document.getElementById(this.id + "detune");
    detune.addEventListener("input", (e) => {
      this.detune = parseFloat(e.target.value);
    });
    const pitch = document.getElementById(this.id + "pitch");
    pitch.addEventListener("input", (e) => {
      this.pitch = e.target.value;
    });
    const filter = document.getElementById(this.id + "cutoff");
    filter.addEventListener("input", (e) => {
      this.cutoff = e.target.value;
    });
    const resonnance = document.getElementById(this.id + "resonnance");
    resonnance.addEventListener("input", (e) => {
      this.resonnance = e.target.value;
    });
    const filterAttackTime = document.getElementById(this.id + "filter-attack");
    filterAttackTime.addEventListener("input", (e) => {
      this.filterEnveloppe.attackTime = parseFloat(e.target.value);
    });
    const filterDecayTime = document.getElementById(this.id + "filter-decay");
    filterDecayTime.addEventListener("input", (e) => {
      this.filterEnveloppe.decayTime = e.target.value;
    });
    const volumeAttackTime = document.getElementById(this.id + "volume-attack");
    volumeAttackTime.addEventListener("input", (e) => {
      this.volumeEnveloppe.attackTime = parseFloat(e.target.value);
    });
    const volumeDecayTime = document.getElementById(this.id + "volume-decay");
    volumeDecayTime.addEventListener("input", (e) => {
      this.volumeEnveloppe.decayTime = e.target.value;
    });
    const waveForm = document.getElementById(this.id + "waveform");
    waveForm.addEventListener("input", (e) => {
      this.waveForm = e.target.value;
    });
    const filterType = document.getElementById(this.id + "filter");
    filterType.addEventListener("input", (e) => {
      this.filterType = e.target.value;
    });
    const pitchLfoSpeed = document.getElementById(this.id + "pitch-lfo-speed");
    pitchLfoSpeed.addEventListener("input", (e) => {
      this.pitchModulation.frequency = e.target.value;
    });
    const pitchLfoAmount = document.getElementById(
      this.id + "pitch-lfo-amount"
    );
    pitchLfoAmount.addEventListener("input", (e) => {
      this.pitchModulation.amplitude = e.target.value;
    });
    const filterLfoSpeed = document.getElementById(
      this.id + "filter-lfo-speed"
    );
    filterLfoSpeed.addEventListener("input", (e) => {
      this.filterModulation.frequency = e.target.value / 10;
    });
    const filterLfoAmount = document.getElementById(
      this.id + "filter-lfo-amount"
    );
    filterLfoAmount.addEventListener("input", (e) => {
      this.filterModulation.amplitude = e.target.value;
    });
    const distorsion = document.getElementById(this.id + "distorsion");
    distorsion.addEventListener("input", (e) => {
      this.distorsion.setAmount(e.target.value);
    });
    const delay = document.getElementById(this.id + "delay");
    delay.addEventListener("input", (e) => {
      this.delay.feedback.gain.value = e.target.value;
    });
    const reverb = document.getElementById(this.id + "reverb");
    reverb.addEventListener("input", (e) => {
      this.reverb.reverbGain.gain.value = e.target.value;
    });
    this.randomValueElement = document.getElementById(this.id + "random-value");
    this.randomValueElement.addEventListener("input", (e) => {
      this.randomValue = e.target.value;
      this.randomValueElement.parentNode.parentNode.classList.add("armed");
      this.isRandomArmed = true;
    });
  }

  unRandomArm() {
    this.randomValueElement.parentNode.parentNode.classList.remove("armed");
    this.isRandomArmed = false;
  }

  createLfos() {
    this.pitchModulation.lfo = audioCtx.createOscillator();
    this.pitchModulation.amount = audioCtx.createGain();

    this.pitchModulation.lfo.frequency.value = this.pitchModulation.frequency;
    this.pitchModulation.amount.gain.value = this.pitchModulation.amplitude;

    this.filterModulation.lfo = audioCtx.createOscillator();
    this.filterModulation.amount = audioCtx.createGain();

    this.filterModulation.lfo.frequency.value = this.filterModulation.frequency;
    this.filterModulation.amount.gain.value = this.filterModulation.amplitude;
  }

  stopLfos(duration) {
    this.filterModulation.stop(audioCtx.currentTime + duration / 1000);
    this.pitchModulation.stop(audioCtx.currentTime + duration / 1000);
  }

  addEnveloppes(filter, synthGain, duration, velocity) {
    filter.frequency.linearRampToValueAtTime(
      this.cutoff,
      audioCtx.currentTime + this.filterEnveloppe.attackTime
    );

    filter.frequency.linearRampToValueAtTime(
      this.filterEnveloppe.decayValue,
      audioCtx.currentTime + (duration / 1000) * this.filterEnveloppe.decayTime
    );

    synthGain.gain.linearRampToValueAtTime(
      this.volume * velocity,
      audioCtx.currentTime + this.volumeEnveloppe.attackTime
    );
    synthGain.gain.linearRampToValueAtTime(
      this.volumeEnveloppe.decayValue,
      audioCtx.currentTime + (duration / 1000) * this.volumeEnveloppe.decayTime
    );
  }
}
