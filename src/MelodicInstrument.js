import { app, time } from "../script.js";
import { Instrument } from "./Instrument.js";

export class MelodicInstrument extends Instrument {
  constructor() {
    super();
    this.frequencies = [];
    this.melodies = [];
    this.hasFirstNote = true;
  }

  generateChord(root, frequencies) {
    let chord = [];
    if (frequencies.indexOf(root) < frequencies.length - 4) {
      chord.push(root);
      chord.push(frequencies[frequencies.indexOf(root) + 2]);
      chord.push(frequencies[frequencies.indexOf(root) + 4]);
    } else if (frequencies.indexOf(root) >= frequencies.length - 2) {
      chord.push(root);
      chord.push(frequencies[frequencies.indexOf(root) - 3] * 2);
      chord.push(frequencies[frequencies.indexOf(root) - 5] * 2);
    } else {
      chord.push(root);
      chord.push(frequencies[frequencies.indexOf(root) + 2]);
      chord.push(frequencies[frequencies.indexOf(root) - 3] * 2);
    }
    return chord;
  }

  generateRandomNoteSequence() {
    let sequence = [];
    for (let i = 0; i < time.totalSteps; i++) {
      if (this.isArmed && !this.isPlaying) {
        this.generateSequence(sequence, i);
        this.isPlaying = true;
        this.isArmed = false;
      } else if (!this.isArmed && this.isPlaying) {
        this.generateSequence(sequence, i);
      } else {
        this.isArmed = false;
        this.isPlaying = false;
        this.generateSilence(sequence);
      }
    }
    this.generateDuration(sequence);
    this.melodies = sequence;
  }

  playNote() {
    if (this.melodies[time.currentStep].note) {
      this.play(
        this.melodies[time.currentStep].note,
        this.melodies[time.currentStep].duration,
        this.melodies[time.currentStep].velocity
      );
    }
  }

  generateSequence(sequence, i) {
    if (i == 0 && this.hasFirstNote) {
      let note = this.frequencies[0];
      let duration = time.stepTime;
      let velocity =
        app.velocities[Math.floor(Math.random() * app.velocities.length)];
      sequence.push({ note, duration, velocity });
    } else {
      if (Math.random() < this.randomValue) {
        let note =
          this.frequencies[Math.floor(Math.random() * this.frequencies.length)];
        let duration = time.stepTime;
        let velocity =
          app.velocities[Math.floor(Math.random() * app.velocities.length)];
        sequence.push({ note, duration, velocity });
      } else {
        let note = false;
        let duration = "";
        let velocity = 0;
        sequence.push({ note, duration, velocity });
      }
    }
  }

  generateSilence(sequence) {
    let note = false;
    let duration = time.stepTime;
    let velocity =
      app.velocities[Math.floor(Math.random() * app.velocities.length)];
    sequence.push({ note, duration, velocity });
  }

  generateDuration(sequence) {
    let duration = 0;
    for (let i = 0; i < sequence.length; i++) {
      if (sequence[i].note) {
        duration = sequence[i].duration;
        for (let j = i + 1; j < sequence.length; j++) {
          if (sequence[j].note === false) {
            duration += sequence[i].duration;
          } else {
            break;
          }
        }
        sequence[i].duration = duration;
      }
    }
  }

  initFrequencies(frequencies) {
    for (let i = 0; i < frequencies.length; i++) {
      this.frequencies.push(frequencies[i]);
    }
  }
}
