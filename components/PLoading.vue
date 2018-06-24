<template>
  <div class="loading-container" v-if="loading">
    <v-layout fill-height align-center justify-center>
      <v-progress-circular :size="70" :width="7" indeterminate color="primary"/>
    </v-layout>
  </div>
</template>

<script>
export default {
  // Do not forget this little guy
  name: 'PLoading',
  // share common functionality with component mixins
  mixins: [],
  // compose new components
  extends: {},
  // component properties/variables
  props: {},
  // variables
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  // when component uses other components
  components: {},
  // methods
  watch: {},
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  },
  // component Lifecycle hooks
  beforeCreate () {},
  mounted () {}
}
</script>

<style scoped>
.loading-container {
  height: 50vh;
  left: 25%;
  position: fixed;
  top: 25%;
  width: 50vw;
  z-index: 10;
}
</style>