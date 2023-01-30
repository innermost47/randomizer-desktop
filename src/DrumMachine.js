import { audioCtx } from "../utils/utils.js";
import { Percussion } from "./Percussion.js";

export class DrumMachine {
  constructor() {
    this.gain = audioCtx.createGain();
    this.kick = new Percussion();
    this.snare = new Percussion();
    this.ride = new Percussion();
    this.chh = new Percussion();
    this.ohh = new Percussion();
    this.clap = new Percussion();
    this.perc = new Percussion();
    this.crash = new Percussion();
    this.properties = [
      "kick",
      "snare",
      "chh",
      "ohh",
      "clap",
      "perc",
      "ride",
      "crash",
    ];
    this.folder = "808";
  }

  init() {
    this.kick.percussionName = "kick";
    this.kick.initBuffers();
    this.kick.name = "Kick";
    this.kick.randomValue = 0.3;
    this.kick.randomValueForBreak = 0.1;
    this.kick.hasVelocity = false;

    this.snare.percussionName = "snare";
    this.snare.initBuffers();
    this.snare.name = "Snare";
    this.snare.randomValue = 0.4;
    this.snare.randomValueForBreak = 0.7;

    this.ride.percussionName = "ride";
    this.ride.initBuffers();
    this.ride.name = "Ride";
    this.ride.randomValue = 0.4;
    this.ride.randomValueForBreak = 0.2;

    this.chh.percussionName = "chh";
    this.chh.initBuffers();
    this.chh.name = "Chh";
    this.chh.randomValue = 0.8;
    this.chh.randomValueForBreak = 0.2;

    this.ohh.percussionName = "ohh";
    this.ohh.initBuffers();
    this.ohh.name = "Ohh";
    this.ohh.randomValue = 0.3;
    this.ohh.randomValueForBreak = 0.5;

    this.clap.percussionName = "clap";
    this.clap.initBuffers();
    this.clap.name = "Clap";
    this.clap.randomValue = 0.2;
    this.clap.randomValueForBreak = 0.6;

    this.perc.percussionName = "perc";
    this.perc.initBuffers();
    this.perc.name = "Perc";
    this.perc.randomValue = 0.2;
    this.perc.randomValueForBreak = 0.4;

    this.crash.percussionName = "crash";
    this.crash.initBuffers();
    this.crash.name = "Crash";
    this.crash.isCrash = true;
  }
}
