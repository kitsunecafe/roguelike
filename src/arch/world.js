import { Map } from 'https://esm.run/immutable'
import {
  curry,
  curryN,
  flip,
  invoker,
  lensProp,
  map,
  of,
  over,
  unless
} from 'https://esm.run/ramda'

const set = invoker(2, 'set')
const get = invoker(1, 'get')
const isPrimitive = (v) => typeof v !== 'object'

export const init = (ecs) => ({
  ecs,
  ...ecs.bind(),
  components: Map(),
  services: Map()
})

export const addService = curry((key, value, world) => ({
  ...world,
  services: set(key, value, world.services)
}))

export const createEntity = (world) => ({ id: world.createEntity(), world })

export const getComponent = (component, world) => {
  const components = unless(Array.isArray, of, component)
  const getComponent = flip(get)(world.components)
  return map(getComponent, components)
}
export const withComponent = curryN(3, (key, value, { id, world }) => {
  const component = get(key, world.components)
  world.addComponent(id, component)

  if (isPrimitive(value)) {
    component[id] = value
  } else {
    Object.entries(value).forEach(([k, v]) => {
      component[k][id] = v
    })
  }

  return { id, world }
})

export const withTag = curryN(2, (key, { id, world }) => {
  const component = get(key, world.components)
  world.addComponent(id, component)

  return { id, world }
})

export const defineComponent = curry((definition, world) =>
  over(
    lensProp('components'),
    set(definition, world.defineComponent(definition)),
    world
  )
)
