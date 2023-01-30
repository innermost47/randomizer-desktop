import { app, time } from "../script.js";
import { audioCtx, volumes } from "../utils/utils.js";
import { Instrument } from "./Instrument.js";

export class Percussion extends Instrument {
  constructor() {
    super();
    this.folder = "808";
    this.percussionNameBuffer = null;
    this.percussionName = "";
    this.totalFileByDrum = 1;
    this.sequence = [];
    this.hasVelocity = true;
    this.sound = null;
    this.randomValueForBreak = 0;
    this.isCrash = false;
  }

  async initBuffers() {
    fetch("./sounds/" + this.folder + "/" + this.percussionName + ".wav")
      .then((response) => {
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        return audioCtx.decodeAudioData(arrayBuffer);
      })
      .then((audioBuffer) => {
        this.percussionNameBuffer = audioBuffer;
      });
  }

  playPercussionWithVelocity(velocity) {
    let gainNode = audioCtx.createGain();
    let percBuffer = audioCtx.createBufferSource();
    percBuffer.buffer = this.percussionNameBuffer;
    gainNode.gain.setValueAtTime(velocity, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioCtx.currentTime + this.sequence[time.currentStep].duration / 1000
    );
    percBuffer.connect(gainNode).connect(volumes.master);
    percBuffer.start(audioCtx.currentTime);
    percBuffer.stop(
      audioCtx.currentTime + this.sequence[time.currentStep].duration / 1000
    );
    setTimeout(() => {
      percBuffer.disconnect();
      gainNode.disconnect();
    }, this.sequence[time.currentStep].duration);
  }

  playDrum() {
    if (!this.isMuted) {
      if (this.sequence[time.currentStep].note) {
        if (this.hasVelocity) {
          this.playPercussionWithVelocity(
            app.velocities[Math.floor(Math.random() * app.velocities.length)]
          );
        } else {
          this.playPercussionWithVelocity(1);
        }
      }
    }
  }

  randomPercussionSequence(isBreak) {
    let sequence = [];
    if (this.isArmed && !this.isPlaying) {
      this.generateSequence(sequence, isBreak);
      this.isPlaying = true;
      this.isArmed = false;
    } else if (!this.isArmed && this.isPlaying) {
      this.generateSequence(sequence, isBreak);
    } else {
      this.isArmed = false;
      this.isPlaying = false;
      this.generateSilence(sequence);
    }
    this.generateDuration(sequence);
    this.sequence = sequence;
  }

  generateSequence(sequence, isBreak) {
    let random = this.randomValue;
    if (isBreak) {
      random = this.randomValueForBreak;
    }
    for (let i = 0; i < time.totalSteps; i++) {
      if (this.isCrash) {
        if (i == 0) {
          let note = true;
          let duration = time.stepTime;
          sequence.push({ note, duration });
        } else {
          let note = false;
          let duration = time.stepTime;
          sequence.push({ note, duration });
        }
      }
      if (!this.isCrash) {
        if (Math.random() < random) {
          let note = true;
          let duration = time.stepTime;
          sequence.push({ note, duration });
        } else {
          let note = false;
          let duration = time.stepTime;
          sequence.push({ note, duration });
        }
      }
    }
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

  generateSilence(sequence) {
    for (let i = 0; i < time.totalSteps; i++) {
      let note = false;
      let duration = time.stepTime;
      sequence.push({ note, duration });
    }
  }
}
