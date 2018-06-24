const nodeExternals = require('webpack-node-externals')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'socketio',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'test with Socket.io' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  plugins: [
    { src: '~/plugins/vue-socket-io.js', ssr: false }
  ],
  css: [
    '~/assets/css/cssgram.css'
  ],
  modules: [
    '@nuxtjs/vuetify'
  ],
  vuetify: {
    // Vuetify options
    //  theme: { }
  },
  /*
  ** Customize the progress bar color
  */
  loading: '~/components/PLoading.vue',
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      '~/node_modules/vue-socket.io'
    ],
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
