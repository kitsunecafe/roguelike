import { pipe } from 'https://esm.run/rambda'
import { createEntity, withComponent } from './arch/ecs.js'

const player = pipe(
    withComponent(Position)
)(createEntity())

