import synth from './audioEngine/synth'

export default {
  _context: null,
  _synth: synth,
  _output: null,
  _ready: false,
  setup () {
    const AudioContext = window.AudioContext || window.webkitAudioContext

    this._context = new AudioContext()
    this._output = this._context.createGain()
    this._output.gain.value = 0.75
    this._output.connect(this._context.destination)

    this._synth.setup(this._context)
    this._synth.connect(this._output)

    this._ready = true
  },
  update (a, d, c) {
    this._synth.update(a, d, c)
  },
  ready () {
    return this._ready
  },
  mute () {
    this._output.gain.value = 0
  },
  unmute () {
    this._output.gain.value = 0.75
  },
  pause () {
    this._synth.pause()
    this._context.suspend()
  },
  resume () {
    this._context.resume()
  }
}
