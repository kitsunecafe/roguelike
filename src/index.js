import { pipe } from 'https://esm.run/rambda'
import { createEntity, withComponent } from './arch/ecs.js'
import Position from './components/position.js'

const player = pipe(
    withComponent(Position(1, 1))
)(createEntity())

