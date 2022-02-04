import { PlaneGeometry } from '../utils/three.js'
import { constructN, invoker, tap, pipe } from 'https://esm.run/ramda'

const constructor = constructN(2, PlaneGeometry)
const rotateX = invoker(1, 'rotateX')
const translate = invoker(3, 'translate')
const halfPI = Math.PI / 2

export default pipe(
  constructor,
  // Ramda doesn't play well with typed arrays
  tap((tile) => (tile.attributes.uv.array[5] = 0.5)),
  tap((tile) => (tile.attributes.uv.array[7] = 0.5)),
  tap(pipe(rotateX(halfPI), translate(0, -50, 0)))
)(100, 100)
