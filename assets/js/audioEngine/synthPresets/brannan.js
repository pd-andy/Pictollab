// [ 185, 293.66, 440 ], // F#
// [ 196, 293.66, 493.88 ], // G
// [ 220, 293.66, 554.37 ], // A
// [ 246.94, 293.66, 587.33 ], // Bm
// [ 293.66, 293.66, 730.99 ], // D

export default {
  chord: [
    [ 185 / 2, 185, 293.66, 440 ], // F#
    [ 293.66 / 2, 293.66, 293.66, 730.99 ], // D
    [ 220 / 2, 220, 293.66, 554.37 ] // A
  ],
  params: [
    { amp: 0, detune: 0, type: 'sawtooth' },
    { amp: 0, detune: 0, type: 'sawtooth' },
    { amp: 0, detune: 0, type: 'sawtooth' },
    { amp: 0, detune: 0, type: 'sawtooth' }
  ]
}
