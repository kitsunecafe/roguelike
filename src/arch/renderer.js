import Babylon from 'https://esm.run/babylonjs@5.0.0-beta.6'

export class Renderer {
  constructor(engine) {
    this.engine = engine
    this.scene = new Babylon.Scene(engine)

    this.camera = new Babylon.UniversalCamera(
      'camera',
      new Babylon.Vector3(0, 0, -500),
      this.scene
    )

    this.camera.minZ = 0.25

    this.scene.gravity = new Babylon.Vector3(0, -9.81, 0)

    this.scene.collisionsEnabled = true
  }

  static create(element) {
    const canvas = document.createElement('canvas')
    element.append(canvas)
    return new Renderer(
      new Babylon.Engine(canvas)
    )
  }

  getNodeByUniqueId(id) {
    if (this.camera.uniqueId === id) return this.camera
    else return this.scene.getMeshByUniqueId(id)
  }

  render() {
    this.scene.render()
  }
}
