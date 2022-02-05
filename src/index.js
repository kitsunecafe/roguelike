import { ECS } from 'https://esm.run/wolf-ecs'
import Babylon from 'https://esm.run/babylonjs@5.0.0-beta.6'
import Eev from 'https://esm.run/eev'
import { __, flip, map, pipe, reduce, tap } from 'https://esm.run/ramda'

import * as World from './arch/world.js'

import * as Components from './components/index.js'
import { Renderer } from './arch/renderer.js'

import Systems from './systems/index.js'
import * as Generator from './utils/map.js'
import * as Map from './arch/map.js'
import * as Model from './arch/model.js'

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

const generator = Generator.init(width, height)
Generator.create(generator)
  .bufferWhile()
  .observe({
    value(tiles) {
      Map.create(renderer, tiles)
    }
  })

const rooms = generator.getRooms()
const [x, z] = rooms[0].getCenter()

const playerModel = pipe(
  Model.init,
  Model.setPosition(new Babylon.Vector3(x, 0, z)),
  Model.setEllipsoid(new Babylon.Vector3(10, 10, 10)),
  Model.withPhysics(true)
)(renderer.scene, 'Player', {}, 'Box')

const light = new Babylon.PointLight('light', new Babylon.Vector3(x, 10, z), renderer.scene)
light.parent = playerModel.mesh
light.specular = new Babylon.Color3(0.1, 0.1, 0.1)
light.intensity = 0.75
light.diffuse = new Babylon.Color3(1, 0.8, 0.6)
light.range = 500

const playerEntity = pipe(
  World.createEntity,
  World.withComponent(Components.Motor, { power: 1000, torque: 0.5 }),
  World.withComponent(Components.Mesh, { id: playerModel.mesh.uniqueId }),
  World.withTag(Components.UsesInput)
)(world)

const cameraModel = pipe(
  Model.fromMesh,
  Model.setParent(playerModel),
  Model.setPosition(Babylon.Vector3.Zero())
)(renderer.camera)


const loadEnemies = async () => {
  const blob = await (await fetch('/static/enemy.jpg')).blob()

  //  var spriteManagerTrees = new BABYLON.SpriteManager("treesManager", blobURL, 2000, 800, scene);
  const url = URL.createObjectURL(blob)

  const spriteManager = new Babylon.SpriteManager('enemies', url, 10, { width: 927, height: 809 }, renderer.scene)

  // const [x, z] = rooms[1].getCenter()
  const enemySprite = new Babylon.Sprite('enemy', spriteManager)
  enemySprite.position = new Babylon.Vector3(x, 0, z)
  enemySprite.size = 100

  const enemy = pipe(
    World.createEntity,
  )(world)
}

// loadEnemies()

const events = new Eev()

const state = {
  world,
  renderer,
  events
}

map((system) => system(state), Systems)
