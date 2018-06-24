const canvas = require('./canvas')
const base64Img = require('base64-img')
const resemble = require('resemblejs')
const socket = require('socket.io')
const { user, events, images } = require('./log')

const now = require('./utils/now')
const print = require('./utils/print')
const today = require('./utils/today')

const imagePath = `./server/img/${today}`
const initTime = now()

let count = 0
let rgb = {
  red: 0,
  green: 0,
  blue: 0
}

module.exports = {
  begin (http) {
    const io = socket(http)
    canvas.setup()
    let mondrian = canvas.draw(count++)

    setInterval(() => {
      const largest = Object.keys(rgb).sort((x, y) => rgb[y] - rgb[x])[0]

      mondrian = canvas.draw(count++, largest)
      io.sockets.emit('UPDATE_MONDRIAN', mondrian)

      if (count % 10 === 0) {
        rgb = {
          red: 0,
          green: 0,
          blue: 0
        }
      }
    }, 60000)

    io.on('connection', (socket) => {
      socket.on('register', (data) => {
        const { UUID } = data
        print(`${UUID}: register`)

        if (!user.get(UUID)) {
          user.add(data)
        }

        socket.emit('SET_FEED', images.get())
        events.addServer('emit/set_feed', UUID, initTime)

        socket.emit('UPDATE_MONDRIAN', mondrian)
        events.addServer('emit/update_mondrian', UUID, initTime)
      })

      socket.on('event', (data) => {
        const { UUID, event } = data
        print(`${UUID}: event – ${event.type}`)

        event.timestamp.server = now() - initTime
        if (user.get(UUID)) {
          user.log(data)
          events.add(data)
        }
      })

      socket.on('disconnect', () => {

      })

      socket.on('upload', ({ UUID, img }) => {
        print(`${UUID}: upload`)

        images.add(img)

        const imageName = `${UUID}-${now()}`
        base64Img.img(img.base64, imagePath, imageName, (e, f) => {
          e ? print(e) : resemble(f).onComplete(d => {
            rgb.red = (rgb.red + d.red) / 2
            rgb.green = (rgb.green + d.green) / 2
            rgb.blue = (rgb.blue + d.blue) / 2
            events.addServer('analyse', d, initTime)
          })
        })

        io.sockets.emit('UPDATE_FEED', img)
        events.addServer('emit/update_feed', UUID, initTime)
      })
    })
  }
}
