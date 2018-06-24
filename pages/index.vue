<template>
  <v-container fill-height>
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title primary-title>
            <h2>About the Project</h2>
          </v-card-title>
          <v-card-text>
            <p>This is a joint research performance project created by the IJAD Dance Company and Queen Mary, University of London. We are exploring audience–performer co-creation and how digital technology may help that process along. To that end you are invited to use this application during the performance to capture images and short videos to be displayed on the projector. Optionally, you are also invited to complete a short questionaire once the performance is over so we can better evaluate what went well and what didn't.</p>
            <h2>Notice</h2>
            <p><i>Before continuing, please read the following notices carefully.</i><p>
            <p>On the following screen this Web app will request access to your devices camera, this is necessary for the app to function. The permission is <b>not</b> permanent and can be revoked at any time; the app will only have access to your devices camera while it is open and in the foreground.</p>
            <p>Additionally, for research purposes some data on how you use the app will be collected. This includes simple stats like how long the app has been open for and how many times you've interacted with it. <b>None</b> of this information can be used to identify you personally: cookies are not used in this app and we don't track your browser behaviour beyond this application.</p>
            <p>For a full breakdown of the data this app collects you can visit <nuxt-link to="/data">this</nuxt-link> page.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn nuxt to="/app">I Understand</v-btn>
          </v-card-actions>
        </v-card> 
      </v-flex>
    </v-layout>
  </v-container>
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
  computed: {},
  // when component uses other components
  components: {},
  // methods
  watch: {},
  methods: {},
  // component Lifecycle hooks
  beforeCreate () {},
  mounted () {
    this.$store.dispatch('logEvent', { type: 'navigation', to: '/' })
  }
}
</script>

<style>
  
</style>