<template>
  <v-card class="preview-container" v-touch="{ left: () => swipe('L'), right: () => swipe('R') }">
    <v-card-text>
      <figure :class="$store.getters.filter">
        <canvas width="720" height="1280" ref="preview"/>
      </figure>
      <v-layout row justify-end>
        <v-flex xs2>
          <v-btn flat icon color="error" @click.stop="reject">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs2>
          <v-btn flat icon color="success" @click.stop="accept">
            <v-icon>check</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  // Do not forget this little guy
  name: 'PImagePreview',
  // share common functionality with component mixins
  mixins: [],
  // compose new components
  extends: {},
  // component properties/variables
  props: {},
  // variables
  data () {
    return {
      video: null
    }
  },
  computed: {},
  // when component uses other components
  components: {},
  // methods
  watch: {},
  methods: {
    update (video) {
      this.video = video
      this.index = 0
      this.draw()
    },
    draw () {
      this.$refs.preview.getContext('2d')
        .drawImage(this.video, 0, 0, 720, 1280)
    },
    reject () {
      this.$emit('close')
    },
    accept () {
      this.$store.dispatch('socketUpload', {
        base64: this.$refs.preview.toDataURL(),
        class: this.$store.getters.filter
      })
      this.$emit('close')
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
    }
  },
  // component Lifecycle hooks
  beforeCreate () {},
  mounted () {}
}
</script>

<style scoped>
canvas {
  width: 100%;
  max-height: 70vh;
}

.preview-container {
  height: auto;
}
</style>