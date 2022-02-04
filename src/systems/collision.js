import { not } from 'https://esm.run/wolf-ecs'
import { curry } from 'https://esm.run/ramda'
import { time$ } from '../arch/clock.js'
import * as World from '../arch/world.js'
import * as Vector from '../utils/math/vector.js'
import {
  Position as PositionKey,
  Velocity as VelocityKey,
  FixedCollision as FixedCollisionKey,
  DynamicCollision as DynamicCollisionKey,
  Impassable as ImpassableKey,
  Fixed as FixedKey
} from '../components/index.js'

export default ({ world }) => {
  const [
    Velocity,
    Position,
    FixedCollision,
    DynamicCollision,
    Impassable,
    Fixed
  ] = World.getComponent(
    [
      VelocityKey,
      PositionKey,
      FixedCollisionKey,
      DynamicCollisionKey,
      ImpassableKey,
      FixedKey
    ],
    world
  )

  const staticEntities = world.createQuery(Position, Impassable, Fixed)

  const revertPosition = curry((collisionType, id, other) => {
    world.removeComponent(id, Velocity)

    World.withComponent(collisionType, { with: other }, { id, world })
  })

  const revertFixed = revertPosition(FixedCollisionKey)
  const revertDynamic = revertPosition(DynamicCollisionKey)

  const getPosition = Vector.fromComponent(Position)
  const getDisp = Vector.fromComponent(Velocity)

  const willCollide = (a, b) =>
    Vector.eq(Vector.add(getPosition(a), getDisp(a)), getPosition(b))

  time$.observe({
    value(input) {
      const movingEntities = world.createQuery(Position, Velocity)
      const dynamicEntities = world.createQuery(
        Position,
        Impassable,
        not(Fixed)
      )

      movingEntities.forEach((a) => {
        world.removeComponent(a, FixedCollision)
        world.removeComponent(a, DynamicCollision)

        staticEntities.forEach((b) => {
          if (willCollide(a, b)) {
            revertFixed(a, b)
          }
        })

        dynamicEntities.forEach((b) => {
          if (a === b) return

          if (willCollide(a, b)) {
            revertDynamic(a, b)
          }
        })

        // Entity "bumps"
        movingEntities.forEach((b) => {
          if (a === b) return

          const posA = getPosition(a)

          const posB = getPosition(b)
          const dispB = getDisp(b)

          if (Vector.eq(posA, posB) || Vector.eq(posA, dispB)) {
            revertDynamic(a, b)
          }
        })
      })
    }
  })
}
