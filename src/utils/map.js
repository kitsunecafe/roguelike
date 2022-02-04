import Kefir from 'https://esm.run/kefir'
import { Map } from 'https://esm.run/rot-js'

export const init = (width, height) =>
  new Map.Digger(width, height, { dugPercentage: 0.9 })

export const create = (gen) =>
  Kefir.stream((emitter) => {
    gen.create((x, y, value) => {
      emitter.emit({ x, y, value })
    })

    emitter.end()
  })

export const debug = (map, w) => {
  const str = map
    .map((v) => (v ? '.' : ' '))
    .join('')
    .replace(new RegExp(`(.{${w}})`, 'g'), '$1\n')
  console.log(str)
}
