import id from 'shortid'
import synth from '~/assets/js/audioEngine/synth'

export const state = () => ({
  cssgram: [
    '',
    '_1977',
    'aden',
    'amaro',
    'brannan',
    'brooklyn',
    'clarendon',
    'gingham',
    'hudson',
    'inkwell',
    'kelvin',
    'lark',
    'lofi',
    'mayfair',
    'moon',
    'nashville',
    'perpetua',
    'reyes',
    'rise',
    'slumber',
    'stinson',
    'toaster',
    'valencia',
    'walden',
    'willow',
    'xpro2'
  ],
  cssgramIndex: 0,
  feed: [],
  initTime: Date.now(),
  log: [],
  mondrian: '',
  user: {
    browser: {
      'Name': '',
      'Version': '',
      'Mobile': null,
      'OS': ''
    },
    engagement: {
      visits: {
        '/': 0,
        '/app': 0,
        '/data': 0,
        '/feed': 0
      }
    },
    interactions: {
      'Touches Registered': 0,
      'Photos Taken': 0,
      'Photos Uploaded': 0
    },
    UUID: id.generate()
  },
  synthIndex: 0
})

export const mutations = {
  SOCKET_UPDATE_FEED (state, image) {
    if (state.feed.length >= 5) { state.feed.shift() }
    state.feed.push(image[0])
  },
  SOCKET_SET_FEED (state, images) { state.feed = Array.from(images[0]) },
  SOCKET_UPDATE_MONDRIAN (state, mondrian) { state.mondrian = mondrian[0] },
  // ---
  BROWSER_SET_NAME ({ user }, name) { user.browser.Name = name },
  BROWSER_SET_VERSION ({ user }, version) { user.browser.Version = version },
  BROWSER_SET_MOBILE ({ user }, mobile) { user.browser.Mobile = mobile },
  BROWSER_SET_OS ({ user }, os) { user.browser.OS = os },
  // ---
  CSSGRAM_NEXT (state) { state.cssgramIndex = state.cssgramIndex + 1 },
  CSSGRAM_PREV (state) { state.cssgramIndex = state.cssgramIndex - 1 },
  // ---
  FEED_PUSH_BACK ({ feed }, img) { feed.push(img) },
  FEED_POP_FRONT ({ feed }) { feed.shift() },
  // ---
  ENGAGEMENT_PAGE_VISIT ({ user }, page) { user.engagement.visits[page]++ },
  // --
  INTERACTIONS_PHOTO_TAKEN ({ user }) { user.interactions['Photos Taken']++ },
  INTERACTIONS_PHOTO_UPLOADED ({ user }) { user.interactions['Photos Uploaded']++ },
  // --
  LOG_EVENT ({ initTime, log }, { type, data }) { log.push({ type, data, timestamp: Date.now() - initTime }) },
  // --
  SYNTH_NEXT (state) { state.synthIndex = state.synthIndex + 1 },
  SYNTH_PREV (state) { state.synthIndex = state.synthIndex - 1 }
}

export const actions = {
  socketUpload ({ dispatch, state }, data) {
    dispatch('logEvent', { type: 'upload' })
    this._vm.$socket.emit('upload', {
      UUID: state.user.UUID,
      img: data
    })
  },
  socketEvent ({ state }, event) {
    this._vm.$socket.emit('event', { UUID: state.user.UUID, event })
  },
  // ---
  setBrowserData ({ commit }, { name, version, mobile, os }) {
    commit('BROWSER_SET_NAME', name)
    commit('BROWSER_SET_VERSION', version)
    commit('BROWSER_SET_MOBILE', mobile)
    commit('BROWSER_SET_OS', os)
  },
  // ---
  logEvent ({ commit, dispatch, state }, data) {
    let event = {}
    switch (data.type) {
      case 'touch':
        event = { type: 'touch', data: null, timestamp: { client: Date.now() - state.initTime } }
        commit('INTERACTIONS_REGISTER_TOUCH')
        commit('LOG_EVENT', event)
        dispatch('socketEvent', event)
        break
      case 'navigation':
        event = { type: 'navigation', data: data.to, timestamp: { client: Date.now() - state.initTime } }
        commit('ENGAGEMENT_PAGE_VISIT', data.to)
        commit('LOG_EVENT', event)
        dispatch('socketEvent', event)
        break
      case 'upload':
        event = { type: 'upload', data: null, timestamp: { client: Date.now() - state.initTime } }
        commit('INTERACTIONS_PHOTO_UPLOADED')
        commit('LOG_EVENT', event)
        dispatch('socketEvent', event)
        break
      case 'capture':
        event = { type: 'capture', data: null, timestamp: { client: Date.now() - state.initTime } }
        commit('INTERACTIONS_PHOTO_TAKEN')
        commit('LOG_EVENT', event)
        dispatch('socketEvent', event)
        break
      case 'register':
        const { user } = state
        this._vm.$socket.emit('register', {
          browser: user.browser,
          UUID: user.UUID,
          log: []
        })
        break
      default:
        break
    }
  },
  synthNextPreset ({ commit, state }) {
    commit('SYNTH_NEXT')
    synth.setPreset(state.synthIndex)
  },
  synthPrevPreset ({ commit, state }) {
    commit('SYNTH_PREV')
    synth.setPreset(state.synthIndex)
  }
}

export const getters = {
  browser: (state) => state.user.browser,
  filter: ({ cssgram, cssgramIndex }) => {
    return cssgramIndex < 0
      ? cssgram[cssgram.length + (cssgramIndex % cssgram.length)]
      : cssgram[cssgramIndex % cssgram.length]
  },
  log: (state) => state.log,
  engagement: state => state.user.engagement,
  feed: (state) => state.feed,
  interactions: state => state.user.interactions,
  UUID: state => state.user.UUID,
  mondrian: state => state.mondrian
}
