import Babylon from 'https://esm.run/babylonjs@5.0.0-beta.6'
import { deltaTime$ } from '../arch/clock.js'
import * as World from '../arch/world.js'
import {
  Mesh as MeshKey,
  Motor as MotorKey,
  Velocity as VelocityKey
} from '../components/index.js'

export default ({ world, renderer }) => {
  const [Mesh, Velocity, Motor] = World.getComponent(
    [MeshKey, VelocityKey, MotorKey],
    world
  )

  deltaTime$.observe({
    value(dt) {
      const dispQuery = world.createQuery(Velocity, Mesh, Motor)

      dispQuery.forEach((id) => {
        const mesh = renderer.scene.getMeshByUniqueID(Mesh.id[id])

        const pos = mesh.forward.scale(Velocity.z[id]).normalize().scale(Motor.power[id] * dt)
        mesh.moveWithCollisions(pos, 1, Babylon.Space.WORLD)

        world.removeComponent(id, Velocity)
      })
    }
  })
}
