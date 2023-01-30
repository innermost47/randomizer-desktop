import { chromaticScale, minorModes } from "../utils/notes.js";
import { pickRandomProperty } from "../utils/utils.js";
import { Mode } from "./Mode.js";

export class ScaleBuilder {
  constructor() {
    this.mode = new Mode();
    this.frequencies = [];
    this.octaves = [0, 1, 2, 3, 4, 5];
  }

  initScale() {
    this.mode.mode = pickRandomProperty(minorModes);
    this.mode.rootNote =
      chromaticScale[Math.floor(Math.random() * chromaticScale.length)];
    this.frequencies = this.mode.getFrequenciesFromMode(this.octaves);
  }
}
