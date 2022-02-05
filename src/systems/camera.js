import Babylon from 'https://esm.run/babylonjs@5.0.0-beta.6'
import { time$ } from '../arch/clock.js'
import * as World from '../arch/world.js'
import {
  Mesh as MeshKey,
  CameraTarget as CameraTargetKey
} from '../components/index.js'

export default function ({ world, renderer }) {
  const [CameraTarget, Mesh] = World.getComponent(
    [CameraTargetKey, MeshKey],
    world
  )

  const query = world.createQuery(CameraTarget, Mesh)

  time$.observe({
    value(t) {
      query.forEach((id) => {
        const mesh = renderer.scene.getMeshByUniqueID(Mesh.id[id])
        // const position = new Babylon.Vector3(Position.x[id], Position.y[id], Position.z[id])
        // const rotation = new Babylon.Vector3(Rotation.x[id], Rotation.y[id], Rotation.z[id])

        renderer.camera.position = mesh.position
        renderer.camera.rotation.copyFrom(mesh.rotation)
        // renderer.camera.rotation = mesh.rotation
      })
    }
  })
}
