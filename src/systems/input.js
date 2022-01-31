import { time$ } from '../arch/clock.js'
import * as World from '../arch/world.js'
import UsesInputDef from '../components/uses-input.js'
import PositionDef from '../components/position.js'
import DisplacementDef from '../components/displacement.js'
import { movement$ } from '../arch/input.js'
import * as Vector from '../utils/math/vector.js'

export default ({ world, display }) => {
  const [Displacement, Position, UsesInput] = World.getComponents(
    DisplacementDef,
    PositionDef,
    UsesInputDef,
    world
  )

  const displace = ({ x, y }, id) =>
    Vector.withComponent(Displacement, { x, y }, { id, world })

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
