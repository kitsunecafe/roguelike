import { time$ } from '../arch/clock.js'
import * as World from '../arch/world.js'
import { UsesInput as UsesInputKey } from '../components/tags.js'
import PositionKey from '../components/position.js'
import DisplacementKey from '../components/messages/displacement.js'
import { movement$ } from '../arch/input.js'
import * as Vector from '../utils/math/vector.js'

export default ({ world }) => {
  const [Position, UsesInput] = World.getComponent(
    [PositionKey, UsesInputKey],
    world
  )

  const displace = ({ x, y }, id) =>
    World.withComponent(DisplacementKey, { x, y }, { id, world })

  movement$.sampledBy(time$).observe({
    value(input) {
      const inputQuery = world.createQuery(Position, UsesInput)

      inputQuery.forEach((entity) => {
        if (!Vector.eq(Vector.Zero, input)) {
          displace(input, entity)
        }
      })
    }
  })
}
