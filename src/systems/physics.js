import { time$ } from '../arch/clock.js'
import * as World from '../arch/world.js'
import { Collider as ColliderKey } from '../components/index.js'

export default function ({ world, renderer }) {
  const [Collider] = World.getComponent([ColliderKey], world)

  time$.observe({
    value(t) {}
  })
}
