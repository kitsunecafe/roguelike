import { ECS } from 'https://esm.run/wolf-ecs'
import Babylon from 'https://esm.run/babylonjs@5.0.0-beta.6'
import Eev from 'https://esm.run/eev'
import { __, flip, map, pipe, reduce } from 'https://esm.run/ramda'

import * as World from './arch/world.js'

import * as Components from './components/index.js'
import { Renderer } from './arch/b-renderer.js'

import Systems from './systems/index.js'
import * as Map from './utils/map.js'

const q = document.querySelector.bind(document)

const main = q('main')

const width = 64
const height = 36

const defineComponents = reduce(
  flip(World.defineComponent),
  __,
  Object.values(Components)
)

const renderer = Renderer.create(main)

const world = pipe(World.init, defineComponents)(new ECS())

const generator = Map.init(width, height)
Map.create(generator)
  .map((tile) => {
    const { x, y } = tile
    pipe(
      World.createEntity,
      World.withComponent(Components.Position, { x, y: 0, z: y }),
      World.withTag(Components.Fixed)
    )(world)

    return tile
  })
  .bufferWhile()
  .observe({
    value(tiles) {
      renderer.createMap(tiles)
    }
  })

const [x, z] = generator.getRooms()[0].getCenter()
const playerMesh = new Babylon.MeshBuilder.CreateBox('Player')

const object = pipe(
  World.createEntity,
  World.withComponent(Components.Position, { x, y: 0, z }),
  World.withComponent(Components.Rotation, { x: 0, y: 0, z: 0 }),
  World.withComponent(Components.Motor, { power: 1000, torque: 0.5 }),
  World.withComponent(Components.Mesh, { id: playerMesh.uniqueId }),
  World.withTag(Components.UsesInput)
)(world)


renderer.camera.parent = playerMesh
renderer.camera.position = Babylon.Vector3.ZeroReadOnly
renderer.camera.ellipsoid = new Babylon.Vector3(1, 1, 1)
renderer.camera.applyGravity = true
renderer.camera.checkCollisions = true

const events = new Eev()

const state = {
  world,
  renderer,
  events
}

map((system) => system(state), Systems)
