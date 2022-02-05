import Babylon from 'https://esm.run/babylonjs@5.0.0-beta.6'
import { last } from 'https://esm.run/ramda'

const halfPI = Math.PI / 2

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

    this.gravity = new Babylon.Vector3(0, -9.81, 0)

    this.scene.collisionsEnabled = true

    const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), this.scene)
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

  toCoord2D(index, width) {
    return [index % width, Math.floor(index / width)]
  }

  toCoord3D(index, width, height) {
    return [
      index % width,
      Math.floor(index / width) % height,
      Math.floor(index / (width * height))
    ]
  }

  toIndex2D(x, y, w) {
    return x * w + y
  }

  toIndex3D(x, y, z, w, h) {
    return x + w * y + w * h * z
  }

  /*
      ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene
      );
  */

  createMap(tiles) {
    const options = { width: 100, height: 100 }
    const pxg = Babylon.MeshBuilder.CreatePlane("px", options)
    pxg.rotate(Babylon.Axis.Y, -halfPI)
    pxg.position.x = -50

    const nxg = Babylon.MeshBuilder.CreatePlane("nx", options)
    nxg.rotation.y = halfPI
    nxg.position.x = 50

    const pzg = Babylon.MeshBuilder.CreatePlane("pz", options)
    pzg.position.z = -50
    pzg.rotation.y = Math.PI

    const nzg = Babylon.MeshBuilder.CreatePlane("nz", options)
    nzg.position.z = 50

    const pyg = Babylon.MeshBuilder.CreatePlane("py", options)
    pyg.rotation.x = halfPI
    pyg.position.y = -50

    const lastTile = last(tiles)

    const width = lastTile.x + 1
    const depth = lastTile.y + 1

    const halfWidth = width / 2
    const halfDepth = depth / 2

    let meshes = []

    const get = (x, y) => {
      const tile = tiles[this.toIndex2D(x, y, depth)]
      if (tile) return tile.value
      else return 1
    }
    const add = (m, i, t) => {
      const clone = m.clone(`${m.name}-${i}`).translate(t, 1, Babylon.Space.WORLD)
      meshes.push(clone)
    }

    for (let i = 0; i < tiles.length; i++) {
      const { x, y: z, value: current } = tiles[i]

      const translation = new Babylon.Vector3(
        x * 100 - halfWidth * 100,
        0,
        z * 100 - halfDepth * 100
      )

      const px = get(x - 1, z)
      const nx = get(x + 1, z)
      const pz = get(x, z - 1)
      const nz = get(x, z + 1)

      const isEmpty = current === 0
      if (isEmpty) add(pyg, i, translation)
      if ((isEmpty && px === 1) || x === 0) add(pxg, i, translation)
      if ((isEmpty && nx === 1) || x === width - 1) add(nxg, i, translation)
      if ((isEmpty && pz === 1) || z === 0) add(pzg, i, translation)
      if ((isEmpty && nz === 1) || z === depth - 1) add(nzg, i, translation)
    }

    const mesh = Babylon.Mesh.MergeMeshes(meshes)
    mesh.checkCollisions = true

    pxg.dispose()
    nxg.dispose()
    pyg.dispose()
    pzg.dispose()
    nzg.dispose()
  }

  render() {
    this.scene.render()
  }
}
