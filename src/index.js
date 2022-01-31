import { pipe } from 'https://esm.run/rambda'
import { createEntity, withComponent } from './arch/ecs.js'
import Position from './components/position.js'

const player = pipe(
  createEntity,
  withComponent(Position(0, 0))
)()

console.log(player)
