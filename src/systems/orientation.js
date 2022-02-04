import * as World from '../arch/world.js'
import { time$ } from '../arch/clock.js'
import {
  Rotate as RotateKey,
  Rotation as RotationKey,
  Mesh as MeshKey,
  Motor as MotorKey
} from '../components/index.js'

export default function ({ world, renderer }) {
  const [Mesh, Rotate, Rotation, Motor] = World.getComponent(
    [MeshKey, RotateKey, RotationKey, MotorKey],
    world
  )

  time$.observe({
    value() {
      world.createQuery(Mesh, Rotate, Rotation).forEach((id) => {
        const mesh = renderer.scene.getObjectById(Mesh.id[id])
        mesh.rotateY(Rotate.y[id] * Motor.torque[id])

        Rotation.x[id] = mesh.rotation.x
        Rotation.y[id] = mesh.rotation.y
        Rotation.z[id] = mesh.rotation.z

        world.removeComponent(id, Rotate)
      })
    }
  })
}
