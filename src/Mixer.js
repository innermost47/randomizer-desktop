import { audioCtx } from "../utils/utils.js";

export class Mixer {
  constructor() {
    this.mixer = document.createElement("div");
    this.mixerTitleContainer = document.createElement("div");
    this.mixerTitle = document.createElement("h2");
    this.slicesContainer = document.createElement("div");
    this.gain = audioCtx.createGain();
  }

  createHtml(parentHTML, drumMachine, synths) {
    this.mixerTitle.innerHTML = "Mixer";
    this.mixer.id = "mixer";
    this.slicesContainer.className = "slices-container";
    this.mixerTitleContainer.appendChild(this.mixerTitle);
    this.mixer.appendChild(this.mixerTitleContainer);
    this.addManySlicesFromOneInstrument(drumMachine);
    this.addOneSliceByInstruments(synths);
    this.mixer.appendChild(this.slicesContainer);
    parentHTML.appendChild(this.mixer);
  }

  addManySlicesFromOneInstrument(instrument) {
    for (let property of instrument.properties) {
      instrument[property].makeSliceViewOnMixer(this.slicesContainer);
    }
  }

  addOneSliceByInstruments(instruments) {
    for (let i = 0; i < instruments.length; i++) {
      instruments[i].makeSliceViewOnMixer(this.slicesContainer);
    }
  }
}
