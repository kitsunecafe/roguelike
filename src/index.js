import { ECS } from 'https://esm.run/wolf-ecs'
import { __, flip, pipe, map, reduce, values } from 'https://esm.run/ramda'
import * as World from './arch/world.js'
import Position from './components/position.js'
import Renderable from './components/renderable.js'
import { Impassable, UsesInput } from './components/tags.js'
import * as Components from './components/index.js'
import * as Systems from './systems/index.js'
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
  World.withComponent(Renderable, { glyph: stringService.add('@') }),
  World.withTag(UsesInput)
)(world)

const enemy = pipe(
  World.createEntity,
  World.withComponent(Position, { x: 5, y: 1 }),
  World.withComponent(Renderable, { glyph: stringService.add('%') }),
  World.withTag(Impassable)
)(world)

const display = new Display(width, height).fill('.').attach(main)

const state = {
  world,
  display
}

map((system) => system(state), values(Systems))
