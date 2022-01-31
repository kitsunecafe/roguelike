import { curry } from 'https://esm.run/ramda'

export const init = (x, y) => ({ x, y })
export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y })
export const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y })
export const eq = (a, b) => a.x === b.x && a.y === b.y
export const fromComponent = curry((component, id) =>
  init(component.x[id], component.y[id])
)
export const Zero = init(0, 0)
