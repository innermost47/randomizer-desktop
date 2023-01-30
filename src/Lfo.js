export class Lfo {
  constructor() {
    this.lfo = null;
    this.amount = null;
    this.frequency = 0;
    this.amplitude = 0;
    this.phase = 0;
  }

  connect(destination) {
    this.lfo.connect(this.amount);
    this.amount.connect(destination);
  }

  start(time) {
    this.lfo.start(time);
  }

  stop(time) {
    this.lfo.stop(time);
  }

  disconnect() {
    this.lfo.disconnect();
    this.amount.disconnect();
  }
}
