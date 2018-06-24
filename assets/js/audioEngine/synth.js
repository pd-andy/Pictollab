import presets from './synthPresets'

export default {
  _context: null,
  _chord: 0,
  _voices: [
    { osc: null, gain: null },
    { osc: null, gain: null },
    { osc: null, gain: null },
    { osc: null, gain: null }
  ],
  _filter: null,
  _output: null,
  _preset: 0,
  setup (context) {
    this._context = context
    this._output = this._context.createGain()
    this._output.gain.value = 0.9

    for (let i = 0; i < this._voices.length; i++) {
      // create osc voice
      this._voices[i].osc = this._context.createOscillator()
      this._voices[i].osc.type = 'sawtooth'
      this._voices[i].osc.start()
      // create gain node for each osc
      this._voices[i].gain = this._context.createGain()
      // connect everything together
      this._voices[i].osc.connect(this._voices[i].gain)
      this._voices[i].gain.connect(this._output)
    }

    this.setPreset(0)
  },
  connect (node) {
    this._output.connect(node)
  },
  update (a, d, c, t = this._context.currentTime + 0.75) {
    for (let i = 0; i < this._voices.length; i++) {
      if (a[i] - 0.1 < this._voices[i].gain.gain.value || a[i] + 0.1 > this._voices[i].gain.gain.value) {
        this._voices[i].gain.gain.linearRampToValueAtTime(a[i], t)
      }
      if (d[i] - 0.1 < this._voices[i].osc.detune.value || d[i] + 0.1 > this._voices[i].osc.detune.value) {
        this._voices[i].osc.detune.linearRampToValueAtTime(d[i], t)
      }
    }

    this.setChord(c, this._context.currentTime + 0.25)
  },
  setChord (c, t = this._context.currentTime + 0.5) {
    this._chord = c

    for (let i = 0; i < this._voices.length; i++) {
      this._voices[i].osc.frequency.exponentialRampToValueAtTime(presets[this._preset].chord[this._chord][i], t)
    }
  },
  setPreset (i) {
    this._preset = i < 0
      ? presets.length + (i % presets.length)
      : i % presets.length
    this.setChord(this._chord)
    // for (let i = 0; i < this._voices.length; i++) {
    //   this._voices[i].osc.detune.value = presets[this._preset].params[i].detune
    //   // this._voices[i].osc.type = presets[this._preset].params[i].type
    //   this._voices[i].gain.gain.value = presets[this._preset].params[i].amp
    // }
  },
  pause () {
    for (let i = 0; i < this._voices.length; i++) {
      this._voices[i].gain.gain.cancelScheduledValues(this._context.currentTime)
      this._voices[i].gain.gain.value = 0
    }
  }
}
