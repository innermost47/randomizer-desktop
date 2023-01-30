import { Delay } from "../FX/Delay.js";
import { Distorsion } from "../FX/Distorsion.js";
import { Reverb } from "../FX/Reverb.js";
import { audioCtx, getRandomColor, volumes } from "../utils/utils.js";

export class Instrument {
  static instance = 0;

  constructor() {
    this.instance = ++Instrument.instance;
    this.gain = audioCtx.createGain();
    this.secondGain = audioCtx.createGain();
    this.gain.gain.value = 0.8;
    this.secondGain.gain.value = 1;
    this.pan = audioCtx.createStereoPanner();
    this.pan.pan.value = 0;
    this.isMuted = false;
    this.isArmed = false;
    this.isPlaying = false;
    this.name = "";
    this.playImg = document.createElement("img");
    this.playImg.src = "./icons/play.svg";
    this.playImg.setAttribute("draggable", false);
    this.stopImg = document.createElement("img");
    this.stopImg.src = "./icons/stop.svg";
    this.stopImg.setAttribute("draggable", false);
    this.isRandomArmed = false;
    this.randomValue = 0.5;
    this.randomValueElement;
    this.distorsion = new Distorsion();
    this.reverb = new Reverb();
    this.convolver = this.reverb.getConvolver();
    this.delay = new Delay();
    this.delay.feedback.gain.value = 0;
    this.reverb.reverbGain.gain.value = 0;
    this.delay.connect(this.secondGain, this.pan);
    this.reverb.connect(this.secondGain, this.pan);
    this.distorsion.connect(this.gain, this.secondGain);
    this.pan.connect(volumes.master);
    this.slice = document.createElement("div");
    this.armButton = document.createElement("div");
  }

  makeSliceViewOnMixer(parentHTML) {
    this.slice.className = "slice";
    this.slice.id = "slice" + this.instance;

    const volumeFader = document.createElement("input");
    volumeFader.type = "range";
    volumeFader.id = "volume-fader-" + this.instance;
    volumeFader.min = 0;
    volumeFader.max = 1;
    volumeFader.step = 0.01;
    volumeFader.value = this.gain.gain.value;
    volumeFader.className = "volume-fader";

    const volumeLabel = document.createElement("label");
    volumeLabel.innerHTML = this.name;
    volumeLabel.id = "volume-label-" + this.instance;
    volumeLabel.className = "instrument-label";

    const panFader = document.createElement("input");
    panFader.type = "range";
    panFader.id = "pan-fader-" + this.instance;
    panFader.className = "pan-fader";
    panFader.min = -1;
    panFader.max = 1;
    panFader.value = 0;
    panFader.step = 0.001;

    const muteCheckbox = document.createElement("input");
    muteCheckbox.type = "checkbox";
    muteCheckbox.id = "mute-checkbox-" + this.instance;
    muteCheckbox.className = "mute-checkbox";
    muteCheckbox.checked = !this.isMuted;

    this.armButton.className = "arm-button";
    this.armButton.id = "arm-button-" + this.instance;
    this.armButton.style.backgroundColor = getRandomColor();
    this.armButton.appendChild(this.playImg);

    this.slice.appendChild(volumeFader);
    this.slice.appendChild(volumeLabel);
    this.slice.appendChild(panFader);
    this.slice.appendChild(muteCheckbox);
    this.slice.appendChild(this.armButton);
    parentHTML.appendChild(this.slice);
  }

  addMixerEventListeners() {
    const volume = document.getElementById("volume-fader-" + this.instance);
    volume.addEventListener("input", (e) => {
      this.gain.gain.value = e.target.value;
    });
    const pan = document.getElementById("pan-fader-" + this.instance);
    pan.addEventListener("input", (e) => {
      this.pan.pan.value = e.target.value;
    });
    const mute = document.getElementById("mute-checkbox-" + this.instance);
    mute.addEventListener("change", (e) => {
      if (e.target.checked) {
        this.isMuted = false;
      } else {
        this.isMuted = true;
      }
    });
    this.armButton.isArmed = this.isArmed;
    this.armButton.addEventListener("click", () => {
      this.armButton.isArmed = !this.armButton.isArmed;
      this.isArmed = this.armButton.isArmed;
      if (!this.armButton.isArmed && !this.isPlaying) {
        this.armButton.classList.remove("flash");
      } else if (!this.armButton.isArmed && this.isPlaying) {
        this.armButton.classList.remove("flash");
      }
    });
  }

  removeClassWhenStop() {
    this.slice.classList.remove("slice-active");
    this.armButton.isArmed = false;
    this.armButton.classList.remove("flash");
    this.armButton.removeChild(this.stopImg);
    this.armButton.appendChild(this.playImg);
  }

  addClassWhenStart() {
    this.slice.classList.add("slice-active");
    this.armButton.isArmed = false;
    this.armButton.classList.remove("flash");
    this.armButton.removeChild(this.playImg);
    this.armButton.appendChild(this.stopImg);
  }

  reInitWhenStop() {
    this.slice.classList.remove("slice-active");
    this.armButton.isArmed = false;
    this.isArmed = false;
    this.armButton.classList.remove("flash");
    this.isPlaying = false;
    if (this.armButton.childNodes[0] == this.stopImg) {
      this.armButton.removeChild(this.stopImg);
      this.armButton.appendChild(this.playImg);
    }
  }
}
