export class Time {
  constructor(callback, errorCallback) {
    this.bpm = 70;
    this.stepTime = (6000 / this.bpm / 4) * 10;
    this.totalSteps = 16;
    this.totalMeasures = 8;
    this.totalSongDuration = 0;
    this.currentMeasure = 0;
    this.currentStep = 0;
    this.currentSongDuration = 0;
    this.isPlaying = false;
    this._callback = callback;
    this._errorCallback = errorCallback;
    this.expected;
    this.timeOut;
  }

  start() {
    this.expected = Date.now() + this.stepTime;
    this.timeOut = setTimeout(this.round.bind(this), this.stepTime);
  }

  stop() {
    clearTimeout(this.timeOut);
  }

  round() {
    let drift = Date.now() - this.expected;
    if (drift > this.stepTime) {
      if (this._errorCallback) {
        console.log(this._errorCallback);
      }
    }
    this.callback();
    this.expected += this.stepTime;
    this.timeOut = setTimeout(this.round.bind(this), this.stepTime - drift);
  }

  get callback() {
    return this._callback;
  }

  set callback(callback) {
    this._callback = callback;
  }

  get errorCallback() {
    return this._errorCallback;
  }

  set errorCallback(errorCallback) {
    this._errorCallback = errorCallback;
  }

  setBpm(bpm) {
    this.stepTime = (6000 / bpm / 4) * 10;
  }
}
