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

        renderer.camera.position = mesh.position
        renderer.camera.rotation.copyFrom(mesh.rotation)
      })
    }
  })
}
