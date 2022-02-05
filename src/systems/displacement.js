import Babylon from 'https://esm.run/babylonjs@5.0.0-beta.6'
import { deltaTime$ } from '../arch/clock.js'
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

  deltaTime$.observe({
    value(dt) {
      const dispQuery = world.createQuery(Velocity, Position, Mesh, Motor)

      dispQuery.forEach((id) => {
        const mesh = renderer.scene.getMeshByUniqueID(Mesh.id[id])

        const pos = mesh.forward.scale(Velocity.z[id]).normalize().scale(Motor.power[id] * dt)
        mesh.moveWithCollisions(pos, 1, Babylon.Space.WORLD)

        Position.x[id] = pos.x
        Position.y[id] = pos.y
        Position.z[id] = pos.z


        world.removeComponent(id, Velocity)
      })
    }
  })
}
