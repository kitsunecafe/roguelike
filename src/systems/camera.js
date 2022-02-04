import { time$ } from '../arch/clock.js'
import * as World from '../arch/world.js'
import {
  Position as PositionKey,
  Rotation as RotationKey,
  CameraTarget as CameraTargetKey
} from '../components/index.js'

export default function ({ world, renderer }) {
  const [CameraTarget, Position, Rotation] = World.getComponent(
    [CameraTargetKey, PositionKey, RotationKey],
    world
  )

  const query = world.createQuery(CameraTarget, Position, Rotation)

  time$.observe({
    value(t) {
      query.forEach((id) => {
        renderer.camera.position.set(
          Position.x[id],
          Position.y[id],
          Position.z[id]
        )

        renderer.camera.rotation.set(
          Rotation.x[id],
          Rotation.y[id],
          Rotation.z[id]
        )
      })
    }
  })
}
