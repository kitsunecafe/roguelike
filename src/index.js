import { pipe, tap } from 'https://esm.run/rambda'
import { createEntity, withComponent } from './arch/ecs.js'
import Position from './components/position.js'
import * as Display from './arch/display.js'
import ml from './utils/jml.js'

const q = document.querySelector.bind(document)

const player = pipe(
  createEntity,
  withComponent(Position(0, 0))
)()

const main = q('main')
const disp = ml('pre', { class: 'display' })
console.log(disp)
main.append(disp)

const width = 64
const height = 36

const display = pipe(
  Display.init,
  Display.attach(disp),
  Display.fillBuffer('.'),
  Display.draw(Math.floor(width / 2), Math.floor(height / 2), '@'),
  Display.render,
)(width, height)

