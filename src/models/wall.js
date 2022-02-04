import { PlaneGeometry } from '../utils/three.js'
import { constructN, tap, pipe } from 'https://esm.run/ramda'

const constructor = constructN(2, PlaneGeometry)

export default pipe(
  constructor,
  // over(uvLens, pipe(set(lensIndex(1), 0.5), set(lensIndex(3), 0.5)))
  tap((tile) => (tile.attributes.uv.array[1] = 0.5)),
  tap((tile) => (tile.attributes.uv.array[3] = 0.5))
)(100, 100)
