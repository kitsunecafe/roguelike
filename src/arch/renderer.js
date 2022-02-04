import { last } from 'https://esm.run/ramda'
import * as Three from '../utils/three.js'

import Wall from '../models/wall.js'
import Floor from '../models/tile.js'

import Storage from '../services/storage.js'

const { Capsule, Octree, BufferGeometryUtils } = Three

const mergeBufferGeometries = BufferGeometryUtils.mergeBufferGeometries.bind(
  BufferGeometryUtils
)

const halfPI = Math.PI / 2

export class Renderer {
  constructor() {
    this.scene = new Three.Scene()
    this.scene.background = new Three.Color(0x555555)
    this.renderer = new Three.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera = new Three.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    )

    this.scene.add(this.camera)

    const light = new Three.DirectionalLight(0xffffff, 0.5)
    this.scene.add(light)

    this.octree = new Octree()
    this.colliders = new Storage()
  }

  attach(container) {
    if (this.container) {
      this.container.removeChild(this.element)
    }

    container.append(this.renderer.domElement)
    this.container = container

    return this
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

  createMap(tiles) {
    const pxg = Wall.clone()
    pxg.rotateY(-halfPI)
    pxg.translate(-50, 0, 0)

    const nxg = Wall.clone()
    nxg.rotateY(halfPI)
    nxg.translate(50, 0, 0)

    const pzg = Wall.clone()
    pzg.translate(0, 0, -50)

    const nzg = Wall.clone()
    nzg.rotateY(Math.PI)
    nzg.translate(0, 0, 50)

    const pyg = Floor.clone()

    const matrix = new Three.Matrix4()

    const lastTile = last(tiles)

    const width = lastTile.x + 1
    const depth = lastTile.y + 1

    const halfWidth = width / 2
    const halfDepth = depth / 2

    const get = (x, y) => {
      const tile = tiles[this.toIndex2D(x, y, depth)]
      if (tile) return tile.value
      else return 1
    }

    const clone = (g) => g.clone().applyMatrix4(matrix)
    let geometries = []

    const add = (g) => geometries.push(clone(g))

    for (let i = 0; i < tiles.length; i++) {
      const { x, y: z, value: cur } = tiles[i]

      matrix.makeTranslation(
        x * 100 - halfWidth * 100,
        0,
        z * 100 - halfDepth * 100
      )

      const px = get(x - 1, z)
      const nx = get(x + 1, z)
      const pz = get(x, z - 1)
      const nz = get(x, z + 1)

      const isEmpty = cur === 0
      if (isEmpty) add(pyg)
      if ((isEmpty && px === 1) || x === 0) add(pxg)
      if ((isEmpty && nx === 1) || x === width - 1) add(nxg)
      if ((isEmpty && pz === 1) || z === 0) add(pzg)
      if ((isEmpty && nz === 1) || z === depth - 1) add(nzg)
    }

    const geometry = mergeBufferGeometries(geometries)
    geometry.computeBoundingSphere()

    const material = new Three.MeshLambertMaterial({
      color: 0x777777,
      side: Three.DoubleSide
    })

    const mesh = new Three.Mesh(geometry, material)
    this.scene.add(mesh)

    this.octree.fromGraphNode(this.scene)

    return mesh
  }

  createCollider(start, stop, radius) {
    const capsule = new Capsule(start, stop, radius)
    return this.colliders.add(capsule)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}
