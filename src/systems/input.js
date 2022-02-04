import * as World from '../arch/world.js'
import {
  Position as PositionKey,
  Velocity as VelocityKey,
  Rotate as RotateKey,
  UsesInput as UsesInputKey
} from '../components/index.js'
import { movement$ } from '../arch/input.js'

export default ({ world }) => {
  const [Position, UsesInput] = World.getComponent(
    [PositionKey, UsesInputKey],
    world
  )

  const displace = ({ y }, id) =>
    World.withComponent(VelocityKey, { z: y }, { id, world })

  const rotate = ({ x }, id) =>
    World.withComponent(RotateKey, { y: x * 0.1 }, { id, world })

  movement$.observe({
    value(input) {
      const inputQuery = world.createQuery(Position, UsesInput)

      inputQuery.forEach((entity) => {
        if (input.y !== 0) {
          displace(input, entity)
        }

        if (input.x !== 0) {
          rotate(input, entity)
        }
      })
    }
  })
}
