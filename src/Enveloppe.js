export class Enveloppe {
  constructor() {
    this._attackTime;
    this._decayTime;
    this._attackValue;
    this._decayValue;
  }

  get attackTime() {
    return this._attackTime;
  }

  get decayTime() {
    return this._decayTime;
  }

  set attackTime(attackTime) {
    this._attackTime = attackTime;
  }

  set decayTime(decayTime) {
    this._decayTime = decayTime;
  }

  get attackValue() {
    return this._attackValue;
  }

  get decayValue() {
    return this._decayValue;
  }

  set attackValue(attackValue) {
    this._attackValue = attackValue;
  }

  set decayValue(decayValue) {
    this._decayValue = decayValue;
  }
}
