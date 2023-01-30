import { audioCtx } from "../utils/utils.js";

export class Reverb {
  constructor() {
    this.convolver = audioCtx.createConvolver();
    this.reverbGain = audioCtx.createGain();
    this.reverbGain.gain.value = 0;
    this.reverbDuration = 0.1;
    this.reverbUrl = "./sounds/FX/reverb.ogg";
  }

  async getConvolver() {
    const reverbBuffer = await fetch(this.reverbUrl).then((response) =>
      response.arrayBuffer()
    );

    const reverbImpulse = await audioCtx.decodeAudioData(reverbBuffer);
    const reverbData = reverbImpulse.getChannelData(0);
    const reverbDuration = this.reverbDuration;
    const reverbLength = reverbData.length / reverbImpulse.sampleRate;
    const ratio = reverbDuration / reverbLength;
    const shortReverbData = new Float32Array(
      Math.round(reverbData.length * ratio)
    );
    shortReverbData.set(reverbData.subarray(0, shortReverbData.length));
    const shortReverbBuffer = audioCtx.createBuffer(
      1,
      shortReverbData.length,
      reverbImpulse.sampleRate
    );
    shortReverbBuffer.getChannelData(0).set(shortReverbData);
    this.convolver.buffer = shortReverbBuffer;
    return this.convolver;
  }

  connect(audioSource, audioDestination) {
    audioSource.connect(this.convolver);
    this.convolver.connect(this.reverbGain);
    this.reverbGain.connect(audioDestination);
  }

  disconnect() {
    this.convolver.disconnect();
    this.reverbGain.disconnect();
  }
}
