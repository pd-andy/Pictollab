// https://codepen.io/sterlu/pen/GEWyqe?editors=0010#0

const fs = require('fs')
const { createCanvas } = require('canvas')

const width = 1080
const height = 1920

const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = canvas.width
const CANVAS_HEIGHT = canvas.height
// const COLORS = ['red', 'green', 'blue']
const COLORS = ['#e74c3c', '#2ecc71', '#3498db']
const STROKE_WIDTH = 20
const CANVAS_PADDING = 50
const HORIZONTAL_GRIDLINES = 4
const VERTICAL_GRIDLINES = 3
const DISTANCE_BETWEEN_POINTS = 50
// ^ must not be more than canvas width/horizontal grid lines
//   or canvas height/vertical grid lines
const NUMBER_OF_RECTANGLES = 1
// ^ This many rectangles will be drawn
//   Keep in mind - duplicate rectangles are not ignored and may be drawn

let points = []

const colours = {
  red: '#e74c3c',
  green: '#2ecc71',
  blue: '#3498db',
  white: '#f5f6fa',
  black: '#2f3640'
}

function removePointsBetween (startPoint, endPoint) {
  // if starting Y coordinate is smaller than ending Y coordinate
  // aka if we're drawing a rectangle in this direction \
  // (top to bottom, left to right)
  if (startPoint[1] < endPoint[1]) {
    for (let i = 0; i < points.length; i++) {
      if (points[i][0] > startPoint[0] && points[i][0] < endPoint[0] && points[i][1] > startPoint[1] && points[i][1] < endPoint[1]) {
        points.splice(i, 1)
        i--
      }
    }
  } else {
  // else we're drawing a rectangle in this direction /
  // (top to bottom, right to left)
    for (let i = 0; i < points.length; i++) {
      if (points[i][0] > startPoint[0] && points[i][0] < endPoint[0] && points[i][1] < startPoint[1] && points[i][1] > endPoint[1]) {
        points.splice(i, 1)
        i--
      }
    }
  }
}

// Find nearest in array
function smallestDistance (point, array) {
  let min = CANVAS_WIDTH
  for (let i = 0; i < array.length; i++) {
    let dist = Math.abs(array[i] - point)
    if (dist < min) min = dist
  }
  return min
}

// Draw vertical/horizontal grid lines
function drawVertical (x) {
  ctx.beginPath()
  ctx.moveTo(x, 0)
  ctx.lineTo(x, CANVAS_HEIGHT)
  ctx.stroke()
}
function drawHorizontal (y) {
  ctx.beginPath()
  ctx.moveTo(0, y)
  ctx.lineTo(CANVAS_WIDTH, y)
  ctx.stroke()
}

// Checks if point is in the points array
function pointInArray (point) {
  for (let i = 0; i < points.length; i++) {
    if (points[i][0] === point[0] && points[i][1] === point[1]) return true
  }
  return false
}

// Return random item from array
function pickRandom (array) {
  return array[Math.floor(Math.random() * array.length)]
}

function drawRect (startPoint, endPoint, colour) {
  // sort points by X coordinates
  if (startPoint[0] > endPoint[0]) {
    let tmp = startPoint
    startPoint = endPoint
    endPoint = tmp
  }

  // if rect surface area > 25% of canvas surface area return false
  if (Math.abs((endPoint[0] - startPoint[0]) * (endPoint[1] - startPoint[1])) > CANVAS_WIDTH * CANVAS_HEIGHT * 0.25) {
    return false
  }

  // rectangle is drawn from X1Y1 to X2Y2
  // check if points X1Y2 or X2Y1 were removed
  // (because were in the middle of another rectangle)
  if (!pointInArray([startPoint[0], endPoint[1]]) || !pointInArray([endPoint[0], startPoint[1]])) {
    return false
  }

  ctx.fillStyle = colour
  const width = endPoint[0] - startPoint[0]
  const height = endPoint[1] - startPoint[1]

  ctx.fillRect(startPoint[0], startPoint[1], width, height)
  ctx.strokeRect(startPoint[0], startPoint[1], width, height)

  // remove points inside the rectangle
  // because rectangles starting from those points would
  // start from the middle of the just-drawn rectangle
  removePointsBetween(startPoint, endPoint)

  return true
}

module.exports = {
  setup () {
    ctx.lineWidth = STROKE_WIDTH
    ctx.fillStyle = colours.white
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    /*
      CREATE THE GRID
    */
    points = [
      [-STROKE_WIDTH, -STROKE_WIDTH],
      [-STROKE_WIDTH, CANVAS_HEIGHT + STROKE_WIDTH],
      [CANVAS_WIDTH + STROKE_WIDTH, -STROKE_WIDTH],
      [CANVAS_WIDTH + STROKE_WIDTH, CANVAS_HEIGHT + STROKE_WIDTH]
    ]

    const coordsY = []
    while (coordsY.length < HORIZONTAL_GRIDLINES) {
      // find coordinates within padded area
      // (we don't want points near edges)
      const pointY = CANVAS_PADDING + Math.floor(Math.random() * (CANVAS_HEIGHT - 2 * CANVAS_PADDING))
      if (smallestDistance(pointY, coordsY) > DISTANCE_BETWEEN_POINTS) {
        coordsY.push(pointY)
        drawHorizontal(pointY)
      }
    }

    const coordsX = []
    while (coordsX.length < VERTICAL_GRIDLINES) {
      const pointX = CANVAS_PADDING + Math.floor(Math.random() * (CANVAS_WIDTH - 2 * CANVAS_PADDING))
      if (smallestDistance(pointX, coordsX) > DISTANCE_BETWEEN_POINTS) {
        coordsX.push(pointX)
        drawVertical(pointX)
      }
    }

    for (let i = 0; i < coordsY.length; i++) {
      points.push([-STROKE_WIDTH, coordsY[i]])
      points.push([CANVAS_WIDTH + STROKE_WIDTH, coordsY[i]])
      for (let j = 0; j < coordsX.length; j++) {
        points.push([coordsX[j], -STROKE_WIDTH])
        points.push([coordsX[j], CANVAS_HEIGHT + STROKE_WIDTH])
        points.push([coordsX[j], coordsY[i]])
      }
    }

    points.sort((a, b) => {
      return a[0] - b[0]
    })

    // this.draw()
  },
  get () {
    return canvas.toDataURL()
  },
  save (path) {
    const out = fs.createWriteStream(path)
    canvas.createPNGStream().pipe(out)
  },
  draw (count, colour) {
    if (count % 10 === 0) {
      this.setup()
    }

    switch (colour) {
      case 'red':
        colour = COLORS[0]
        break
      case 'green':
        colour = COLORS[1]
        break
      case 'blue':
        colour = COLORS[2]
        break
      default:
        colour = pickRandom(COLORS)
    }

    // clearTimeout(timeoutSignature)
    let i = 0
    let rectPoints = Array.from(points)
    while (i < NUMBER_OF_RECTANGLES && rectPoints.length > 0) {
      let startPoint = pickRandom(rectPoints)
      let endPoint = pickRandom(rectPoints)
      if (startPoint[0] !== endPoint[0] && startPoint[1] !== endPoint[1]) {
        if (drawRect(startPoint, endPoint, colour)) {
          i++
        }
      }
    }

    this.save(`./server/canvas/${new Date().toDateString()}-${Date.now()}.png`)

    // timeoutSignature = setTimeout(() => {
    // if (count % 10 === 0) {
    //   this.setup()
    // } else {
    //   this.draw()
    // }
    // }, 1 * 60000)

    return canvas.toDataURL()
  }
}
