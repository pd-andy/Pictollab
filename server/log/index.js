const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(`./server/log/${new Date().toDateString()}.json`)
const db = low(adapter)

const now = require('../utils/now')

db.defaults({
  users: [],
  events: [],
  images: []
}).write()

module.exports = {
  user: {
    get (UUID) {
      return db.get('users')
        .find({ UUID })
        .value()
    },
    add (data) {
      db.get('users')
        .push(data)
        .write()
    },
    log (data) {
      db.get('users')
        .find({ UUID: data.UUID })
        .get('log')
        .push(data.event)
        .write()
    }
  },
  events: {
    get () {
      return db.get('events')
        .value()
    },
    add (data) {
      db.get('events')
        .push(data)
        .write()
    },
    addServer (type, data, initTime) {
      this.add({
        UUID: 'SERVER',
        event: {
          type,
          data,
          timestamp: {
            server: now() - initTime
          }
        }
      })
    }
  },
  images: {
    get () {
      return db.get('images')
        .value()
    },
    add (data) {
      let images = db.get('images')

      if (images.value().length >= 2) {
        images.shift()
          .write()
      }
      images.push(data)
        .write()
    }
  }
}
