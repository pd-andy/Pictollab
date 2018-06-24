<template>
  <v-layout class="camera-container" v-touch="{ left: () => swipe('L'), right: () => swipe('R') }">
    <v-dialog v-model="dialog" max-width="750px">
      <p-image-preview ref="preview" v-on:close="dialog = false"/>
    </v-dialog>

    <div :class="$store.getters.filter">
      <video ref="display" autoplay/>
    </div>

    <div>
      <v-btn fab id="mute-button" @click.stop="mute">
        <v-icon>{{ muted ? 'volume_up' : 'volume_off' }}</v-icon>
      </v-btn>
      <v-btn large fab id="camera-button" @click.stop="capture">
        <v-icon large>camera</v-icon>
      </v-btn>
      <v-btn fab id="data-button" nuxt to="/data">
        <v-icon>bar_chart</v-icon>
      </v-btn>
      <v-btn fab id="feed-button" nuxt to="/feed">
        <v-icon>photo_library</v-icon>
      </v-btn>
    </div>
  </v-layout>
</template>

<script>
import PImagePreview from '~/components/PImagePreview'

import getRGB from '~/assets/js/getColour'
import synth from '~/assets/js/audioEngine'

export default {
  // Do not forget this little guy
  name: '',
  // share common functionality with component mixins
  mixins: [],
  // compose new components
  extends: {},
  // component properties/variables
  props: {},
  // variables
  data () {
    return {
      constraints: {
        audio: false,
        video: {
          facingMode: 'environment'
        }
      },
      dialog: false,
      stream: null,
      timeoutID: 0,
      muted: false
    }
  },
  computed: {},
  // when component uses other components
  components: {
    PImagePreview
  },
  // methods
  watch: {
    dialog () {
      if (this.dialog) {
        this.$refs.display.pause()
        clearTimeout(this.timeoutID)
      } else {
        this.$refs.display.play()
        this.timeoutID = setTimeout(() => this.analyse(), 1000)
      }
    },
    muted () {
      this.muted
        ? synth.mute()
        : synth.unmute()
    }
  },
  methods: {
    analyse () {
      this.timeoutID = setTimeout(() => this.analyse(), 1000)
      const RGB = getRGB(document.querySelector('video'))

      const largest = Object.keys(RGB).sort((x, y) => RGB[y] - RGB[x])
      const c = largest[0] === 'brightness'
        ? largest[1] === 'r'
          ? 0
          : largest[1] === 'b'
            ? 1
            : 2
        : largest[0] === 'r'
          ? 0
          : largest[0] === 'b'
            ? 1
            : 2

      synth.update(
        [ RGB.r / 512, RGB.r / 512, RGB.g / 512, RGB.b / 512 ],
        [ RGB.brightness / 5, RGB.brightness / 5, RGB.brightness / 5, RGB.brightness / 5 ],
        c
      )

      return RGB
    },
    capture () {
      this.dialog = true
      this.$refs.preview.update(this.$refs.display)
      this.$store.dispatch('logEvent', { type: 'capture' })
    },
    swipe (direction) {
      switch (direction) {
        case 'L':
          this.$store.commit('CSSGRAM_NEXT')
          this.$store.dispatch('synthNextPreset')
          break
        case 'R':
          this.$store.commit('CSSGRAM_PREV')
          this.$store.dispatch('synthPrevPreset')
          break
      }
    },
    mute () {
      this.muted = !this.muted
    }
  },
  // component Lifecycle hooks
  beforeCreate () {},
  mounted () {
    this.$store.dispatch('logEvent', { type: 'navigation', to: '/app' })
    if (process.browser) {
      navigator.mediaDevices.getUserMedia(this.constraints)
        .then(stream => {
          this.stream = stream
          this.$refs.display.srcObject = this.stream
          this.timeoutID = setTimeout(() => this.analyse(), 1000)
          if (!synth.ready()) {
            synth.setup()
          } else {
            synth.resume()
          }
        })
        .catch(error => console.log(error))
    }
  },
  beforeDestroy () {
    synth.pause()
    this.stream.getTracks().forEach(track => track.stop())
    clearTimeout(this.timeoutID)
  }
}
</script>

<style>
video {
  height: 100vh;
  object-fit: cover;
  width: 100vw;
}

#mute-button {
  position: absolute;
  left: 75vw; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
  top: 2.5%;
}

#camera-button {
  position: absolute;
  left: 0; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
  bottom: 5%;
}

#data-button {
  position: absolute;
  left: 0; 
  right: 75vw; 
  margin-left: auto; 
  margin-right: auto; 
  bottom: 2.5%;
}

#feed-button {
  position: absolute;
  left: 75vw; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
  bottom: 2.5%;
}

.camera-container {
  height: 100vh;
  overflow: hidden;
}
</style>