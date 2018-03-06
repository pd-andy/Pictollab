import Vue from 'vue'
import VueSocketio from 'vue-socket.io'

export default ({ app }) => {
  Vue.use(VueSocketio, 'http://localhost:5000', app.store)
}
