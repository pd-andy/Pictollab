export const state = () => ({
  sidebar: false,
  count: 0,
  io: {}
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  SOCKET_COUNTER_INCREMENT (state, counter) {
    state.count = counter[0]
  },
  SOCKET_COUNTER_DECREMENT (state, counter) {
    state.count = counter[0]
  },
  setSocket: (state, socket) => {
    state.io = socket
    console.log('socket conectado')
  }
}

export const actions = {
  socket_increment: ({state, rootState}) => {
    rootState.io.emit('increment', state.count)
  },
  socket_decrement: ({state, rootState}) => {
    rootState.io.emit('decrement', state.count)
  }
}

export const getters = {
  count (state) {
    return state.count
  }
}
