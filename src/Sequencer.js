import { app, time } from "../script.js";
import { audioCtx, volumes } from "../utils/utils.js";
import { Menu } from "./Menu.js";

export class Sequencer {
  constructor() {
    this.synths = [];
    this.percussions = [];
    this.progress = document.createElement("div");
    this.stepsProgress = document.createElement("progress");
    this.measuresProgress = document.createElement("progress");
    this.controls = document.createElement("div");
    this.playBtn = document.createElement("button");
    this.updateBpm = document.createElement("input");
    this.updateBpmLabel = document.createElement("label");
    this.bpmContainer = document.createElement("div");
    this.logo = document.createElement("img");
    this.controlsContainer = document.createElement("div");
    this.title = document.createElement("h4");
    this.menu = new Menu();
    this.isBreak = true;
    this.updateView();
  }

  loop() {
    if (time.currentStep == 0 && time.currentMeasure == 0) {
      for (let i = 0; i < this.synths.length; i++) {
        if (this.synths[i].isArmed && !this.synths[i].isPlaying) {
          this.synths[i].addClassWhenStart();
        } else if (this.synths[i].isArmed && this.synths[i].isPlaying) {
          this.synths[i].removeClassWhenStop();
        }
      }
      for (let i = 0; i < this.percussions.length; i++) {
        if (this.percussions[i].isArmed && !this.percussions[i].isPlaying) {
          this.percussions[i].addClassWhenStart();
        } else if (
          this.percussions[i].isArmed &&
          this.percussions[i].isPlaying
        ) {
          this.percussions[i].removeClassWhenStop();
        }
      }
      this.generateRandomDrumsSequences(!this.isBreak);
      this.generateRandomInstrumentsSequences();
      for (let i = 0; i < this.synths.length; i++) {
        if (this.synths[i].isRandomArmed) {
          this.synths[i].unRandomArm();
        }
      }
    }
    for (let i = 0; i < this.percussions.length; i++) {
      if (
        this.percussions[i].isCrash &&
        !this.percussions[i].isMuted &&
        time.currentStep == 0 &&
        time.currentMeasure == 0
      ) {
        this.percussions[i].playDrum();
      }
      if (!this.percussions[i].isMuted && !this.percussions[i].isCrash) {
        this.percussions[i].playDrum();
      }
    }

    for (let i = 0; i < this.synths.length; i++) {
      if (!this.synths[i].isMuted) {
        this.synths[i].playNote();
      }
    }
    this.updateView();
    time.currentStep++;
    if (time.currentStep == time.totalSteps) {
      time.currentStep = 0;
      time.currentMeasure++;
      if (time.currentMeasure == time.totalMeasures) {
        time.currentMeasure = 0;
        time.currentSongDuration++;
      }
    }
  }
  generateRandomDrumsSequences(isBreak) {
    for (let i = 0; i < this.percussions.length; i++) {
      this.percussions[i].randomPercussionSequence(isBreak);
    }
  }

  generateRandomInstrumentsSequences() {
    for (let i = 0; i < this.synths.length; i++) {
      this.synths[i].generateRandomNoteSequence();
    }
  }

  createHtml(parentHTML) {
    this.logo.src = "/images/logo.png";
    this.logo.id = "logo";
    this.controlsContainer.className = "controls-container";
    this.progress.id = "progress";
    this.stepsProgress.id = "steps-progress";
    this.measuresProgress.id = "measures-progress";
    this.stepsProgress.max = time.totalSteps - 1;
    this.measuresProgress.max = time.totalMeasures - 1;
    this.controls.className = "controls";
    this.playBtn.innerHTML = "Play";
    this.playBtn.id = "play";
    this.updateBpm.id = "update-bpm";
    this.updateBpm.type = "range";
    this.updateBpm.min = 50;
    this.updateBpm.max = 250;
    this.updateBpm.step = 1;
    this.updateBpm.value = time.bpm;
    this.updateBpmLabel.innerHTML = time.bpm + " BPM";
    this.bpmContainer.className = "bpm-container";
    this.title.innerHTML = app.track.title;
    this.controlsContainer.appendChild(this.playBtn);
    this.controlsContainer.appendChild(this.progress);
    this.controlsContainer.appendChild(this.bpmContainer);
    this.progress.appendChild(this.stepsProgress);
    this.progress.appendChild(this.measuresProgress);
    this.bpmContainer.appendChild(this.updateBpm);
    this.bpmContainer.appendChild(this.updateBpmLabel);
    this.controls.appendChild(this.controlsContainer);
    this.controls.appendChild(this.title);
    this.menu.createHtml(this.controls);
    parentHTML.appendChild(this.controls);
  }

  addEventsListeners() {
    this.playBtn.addEventListener("click", () => {
      time.isPlaying = !time.isPlaying;
      if (time.isPlaying) {
        this.playBtn.innerHTML = "Stop";
        this.start();
      } else {
        this.playBtn.innerHTML = "Play";
        this.stop();
      }
    });
    this.updateBpm.addEventListener("input", (e) => {
      time.setBpm(e.target.value);
      this.updateBpmLabel.innerHTML = e.target.value + " BPM";
      for (let i = 0; i < app.synths.length; i++) {
        app.synths[i].delay.delay.delayTime.value = (time.stepTime / 1000) * 2;
      }
    });
  }

  updateView() {
    this.stepsProgress.value = time.currentStep;
    this.measuresProgress.value = time.currentMeasure;
  }

  start() {
    this.initFX();
    this.connect();
    time.currentMeasure = 0;
    time.currentStep = 0;
    time.currentSongDuration = 0;
    time.callback = this.loop.bind(this);
    time.errorCallback = "error";
    time.start();
  }

  stop() {
    time.stop();
    time.currentMeasure = 0;
    time.currentStep = 0;
    time.currentSongDuration = 0;
    for (let i = 0; i < this.synths.length; i++) {
      this.synths[i].reInitWhenStop();
    }
    for (let i = 0; i < this.percussions.length; i++) {
      this.percussions[i].reInitWhenStop();
    }
    this.updateView();
    this.disconnect();
  }

  initFX() {
    volumes.master.gain.value = 1;
  }

  connect() {
    volumes.master.connect(audioCtx.destination);
  }

  disconnect() {
    volumes.master.disconnect();
  }
}
