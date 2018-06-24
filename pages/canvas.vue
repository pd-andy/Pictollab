<template>
  <v-layout row wrap>
    <img :src="mondrian" width="1080" height="1920">

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
    mondrian () { return this.$store.getters.mondrian }
  },
  // when component uses other components
  components: {},
  // methods
  watch: {},
  methods: {},
  // component Lifecycle hooks
  beforeCreate () {},
  mounted () {
    this.$store.dispatch('logEvent', { type: 'navigation', to: '/canvas' })
  }
}
</script>

<style scoped>
img {
  height: 100vh;
  object-fit: cover;
  width: 100vw;
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