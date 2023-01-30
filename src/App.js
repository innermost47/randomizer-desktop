import { filterTypes, waveShapes } from "../utils/utils.js";
import { DrumMachine } from "./DrumMachine.js";
import { Mixer } from "./Mixer.js";
import { MonoSynth } from "./MonoSynth.js";
import { PolySynth } from "./PolySynth.js";
import { ScaleBuilder } from "./ScaleBuilder.js";
import { Sequencer } from "./Sequencer.js";
import { Track } from "./Track.js";

export class App {
  constructor(time) {
    this.time = time;
    this.mixer = new Mixer();
    this.bassSynth = new MonoSynth();
    this.triSynth = new MonoSynth();
    this.superSaw = new PolySynth();
    this.chordSynth = new PolySynth();
    this.drumMachine = new DrumMachine();
    this.scaleBuilder = new ScaleBuilder();
    this.sequencer = new Sequencer();
    this.track = new Track();
    this.synthsHTML = document.createElement("div");
    this.velocities = [0.5, 1];
    this.startTime = Date.now();
    this.app = document.getElementById("app");
    this.synths = [
      this.bassSynth,
      this.triSynth,
      this.chordSynth,
      this.superSaw,
    ];
    this.percussions = [
      this.drumMachine.kick,
      this.drumMachine.snare,
      this.drumMachine.chh,
      this.drumMachine.ohh,
      this.drumMachine.clap,
      this.drumMachine.perc,
      this.drumMachine.ride,
      this.drumMachine.crash,
    ];
    this.armButtons;
    this.defaultsSettings = {};
  }

  init() {
    this.initDrumMachine();
    this.initSynths();
    this.initSequencer();
    this.initSynthsHTML();
    this.initMixer();
    this.initArmButton();
    this.initScaleAndFrequencies();
    this.initDefaultSettings();
  }

  initDrumMachine() {
    this.drumMachine.init();
  }

  initSynths() {
    this.bassSynth.filterType = filterTypes.LPF;
    this.bassSynth.waveForm = waveShapes.SAW;
    this.bassSynth.name = "Bass synth";

    this.triSynth.resonnance = 2;
    this.triSynth.filterType = filterTypes.LPF;
    this.triSynth.waveForm = waveShapes.TRI;
    this.triSynth.name = "Mono synth";
    this.triSynth.delay.feedback.gain.value = 0.3;
    this.triSynth.reverb.reverbGain.gain.value = 0.1;

    this.superSaw.filterType = filterTypes.LPF;
    this.superSaw.waveForm = waveShapes.SAW;
    this.superSaw.name = "Super Saw";
    this.superSaw.hasFirstNote = false;
    this.superSaw.delay.feedback.gain.value = 0.3;
    this.superSaw.reverb.reverbGain.gain.value = 0.1;
    this.superSaw.detune = 1;

    this.chordSynth.filterType = filterTypes.LPF;
    this.chordSynth.waveForm = waveShapes.SAW;
    this.chordSynth.name = "Chords";
    this.chordSynth.delay.feedback.gain.value = 0.3;
    this.chordSynth.reverb.reverbGain.gain.value = 0.1;
  }

  initSequencer() {
    this.sequencer.synths = this.synths;
    this.sequencer.percussions = this.percussions;
    this.sequencer.createHtml(this.app);
    this.sequencer.addEventsListeners();
    this.sequencer.menu.createModal(this.app);
    this.sequencer.menu.addEventsListeners();
  }

  initSynthsHTML() {
    this.synthsHTML.id = "synths";
    for (let i = 0; i < this.sequencer.synths.length; i++) {
      this.sequencer.synths[i].createHtml(this.synthsHTML);
    }
    this.app.appendChild(this.synthsHTML);
    for (let i = 0; i < this.sequencer.synths.length; i++) {
      this.sequencer.synths[i].addEventsListeners();
    }
  }

  initMixer() {
    this.mixer.createHtml(this.app, this.drumMachine, this.sequencer.synths);

    for (let property of this.drumMachine.properties) {
      this.drumMachine[property].addMixerEventListeners();
    }

    for (let i = 0; i < this.sequencer.synths.length; i++) {
      this.sequencer.synths[i].addMixerEventListeners();
    }
  }

  initArmButton() {
    this.armButtons = document.querySelectorAll(".arm-button");
    setInterval(() => {
      const elapsedTime = Date.now() - this.startTime;
      this.armButtons.forEach((button) => {
        if (button.isArmed) {
          button.classList.toggle("flash", elapsedTime % 800 < 400);
        }
      });
    }, 30);
  }

  initScaleAndFrequencies() {
    this.scaleBuilder.initScale();

    this.superSaw.initFrequencies([
      [this.scaleBuilder.frequencies[14]],
      [this.scaleBuilder.frequencies[18]],
      [this.scaleBuilder.frequencies[16]],
      [this.scaleBuilder.frequencies[21]],
    ]);
    this.bassSynth.initFrequencies([
      this.scaleBuilder.frequencies[7],
      this.scaleBuilder.frequencies[9],
      this.scaleBuilder.frequencies[11],
      this.scaleBuilder.frequencies[14],
    ]);
    this.triSynth.initFrequencies([
      this.scaleBuilder.frequencies[28],
      this.scaleBuilder.frequencies[29],
      this.scaleBuilder.frequencies[30],
      this.scaleBuilder.frequencies[31],
      this.scaleBuilder.frequencies[33],
      this.scaleBuilder.frequencies[34],
      this.scaleBuilder.frequencies[34],
      this.scaleBuilder.frequencies[35],
    ]);
    this.chordSynth.initFrequencies([
      this.chordSynth.generateChord(
        this.scaleBuilder.frequencies[21],
        this.scaleBuilder.frequencies
      ),
    ]);
  }

  initDefaultSettings() {
    let settings = {};
    let inputElements = document.querySelectorAll("input");
    for (let i = 0; i < inputElements.length; i++) {
      let inputElement = inputElements[i];
      settings[inputElement.id] = inputElement.value;
    }
    this.defaultsSettings = settings;
  }
}
