import { ECS } from 'https://esm.run/wolf-ecs'
import { __, flip, pipe, reduce, values } from 'https://esm.run/ramda'
import * as World from './arch/world.js'
import Position from './components/position.js'
import Renderable from './components/renderable.js'
import RenderSystem from './systems/render.js'
import InputSystem from './systems/input.js'
import * as Components from './components/index.js'
import Display from './arch/display.js'
import StringService from './services/strings.js'

const q = document.querySelector.bind(document)

const main = q('main')

const width = 64
const height = 36

const stringService = new StringService()

const defineComponents = reduce(
  flip(World.defineComponent),
  __,
  values(Components)
)

const world = pipe(
  World.init,
  World.addService('string', stringService),
  defineComponents
)(new ECS())

const player = pipe(
  World.createEntity,
  World.withComponent(Position, { x: 1, y: 1 }),
  World.withComponent(Renderable, { glyph: stringService.add('@') })
)(world)

const display = new Display(width, height).fill('.').attach(main)

const state = {
  world,
  display
}

InputSystem(state)
RenderSystem(state)
