import Babylon from 'https://esm.run/babylonjs@5.0.0-beta.6'
import * as World from '../arch/world.js'
import { time$ } from '../arch/clock.js'
import {
  Rotate as RotateKey,
  Mesh as MeshKey,
  Motor as MotorKey
} from '../components/index.js'

export default function ({ world, renderer }) {
  const [Mesh, Rotate, Motor] = World.getComponent(
    [MeshKey, RotateKey, MotorKey],
    world
  )

  time$.observe({
    value() {
      world.createQuery(Mesh, Rotate).forEach((id) => {
        const mesh = renderer.getNodeByUniqueId(Mesh.id[id])
        mesh.rotate(Babylon.Axis.Y, Rotate.y[id] * Motor.torque[id])

        world.removeComponent(id, Rotate)
      })
    }
  })
}
