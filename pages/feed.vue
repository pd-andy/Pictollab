<template>
  <v-layout row wrap>
    <template v-for="(img, i) in feed">
      <v-flex xs12 :key="i" class="image-container">
        <figure :class="img.class">
          <img :src="img.base64">
        </figure>
      </v-flex>
    </template>

    <div>
      <v-btn icon id="back-button" nuxt to="/app">
        <v-icon large>keyboard_backspace</v-icon>
      </v-btn>
    </div>
  </v-layout>
</template>

<script>
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

    }
  },
  computed: {
    feed () { return this.$store.getters.feed }
  },
  // when component uses other components
  components: {},
  // methods
  watch: {
    feed (f) {
      if (f.length > 0) this.$nuxt.$loading.finish()
    }
  },
  methods: {},
  // component Lifecycle hooks
  beforeCreate () {},
  mounted () {
    if (this.feed.length < 1) {
      this.$nextTick(() => { this.$nuxt.$loading.start() })
    }
    this.$store.dispatch('logEvent', { type: 'navigation', to: '/feed' })
  }
}
</script>

<style scoped>
img {
  height: 100vh;
  object-fit: cover;
  width: 100vw;
}

.image-container {
  max-height: 100vh;
  overflow: hidden;
}

#back-button {
  position: fixed;
  left: 0; 
  right: 80vw; 
  margin-left: auto; 
  margin-right: auto; 
  top: 2.5%;
}
</style>