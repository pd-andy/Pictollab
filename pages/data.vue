<template>
  <div>
    <v-toolbar>
      <v-btn flat nuxt to="/">
        <v-icon dark left>arrow_back</v-icon>About
      </v-btn>
      <v-spacer/>
      <v-btn flat nuxt to="/app">
        App<v-icon dark right>arrow_forward</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list dense>
      <v-subheader>Unique ID</v-subheader>
      <v-list-tile>
        <v-list-tile-content>{{ UUID }}</v-list-tile-content>
      </v-list-tile>
      <v-divider/>

      <v-subheader>Browser Data</v-subheader>
      <v-list-tile v-for="i in Object.keys(browser)" :key="i">
        <v-list-tile-content>{{ i }}: {{ browser[i] }}</v-list-tile-content>
      </v-list-tile>
      <v-divider/>

      <v-subheader>Interaction Data</v-subheader>
      <v-list-tile v-for="i in Object.keys(interactions)" :key="i">
        <v-list-tile-content>{{ i }}: {{ interactions[i] }}</v-list-tile-content>
      </v-list-tile>
      <v-divider/>

      <v-subheader>Engagement Data</v-subheader>
      <v-list-tile><b>Page Visits</b></v-list-tile>
      <v-list-tile v-for="i in Object.keys(engagement.visits)" :key="i">
        <v-list-tile-content>{{ i }}: {{ engagement.visits[i] }}</v-list-tile-content>
      </v-list-tile>
      <v-divider/>

       <v-subheader>Event Log</v-subheader>
    </v-list>

    <template>
      <v-data-table :headers="headers" :items="log" hide-actions>
        <template slot="items" slot-scope="props">
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.data }}</td>
          <td>{{ props.item.timestamp }}</td>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
      headers: [
        { text: 'Type', align: 'left', sortable: false, value: 'type' },
        { text: 'Data', align: 'left', sortable: false, value: 'data' },
        { text: 'Timestamp', align: 'left', sortable: true, value: 'timestamp' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'UUID',
      'interactions',
      'browser',
      'engagement',
      'log'
    ])
  },
  // when component uses other components
  components: {},
  // methods
  watch: {},
  methods: {},
  // component Lifecycle hooks
  beforeCreate () {},
  mounted () {
    this.$store.dispatch('logEvent', { type: 'navigation', to: '/data' })
  }
}
</script>

<style scoped>

</style>