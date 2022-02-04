import { time$ } from '../arch/clock.js'
import * as World from '../arch/world.js'
import {
  Mesh as MeshKey,
  Position as PositionKey,
  Motor as MotorKey,
  Velocity as VelocityKey
} from '../components/index.js'

export default ({ world, renderer }) => {
  const [Mesh, Velocity, Position, Motor] = World.getComponent(
    [MeshKey, VelocityKey, PositionKey, MotorKey],
    world
  )

  time$.observe({
    value(input) {
      const dispQuery = world.createQuery(Velocity, Position, Motor)

      dispQuery.forEach((entity) => {
        const mesh = renderer.scene.getObjectById(Mesh.id[entity])
        mesh.translateZ(Velocity.z[entity] * Motor.power[entity])

        Position.x[entity] = mesh.position.x
        Position.z[entity] = mesh.position.z

        world.removeComponent(entity, Velocity)
      })
    }
  })
}
