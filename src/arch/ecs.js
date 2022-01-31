import { ECS } from 'https://esm.run/wolf-ecs'
import { curry } from 'https://esm.run/rambda'

export const ecs = new ECS()
const { createEntity, defineComponent } = ecs.bind()
export { createEntity, defineComponent }

export const withComponent = curry(({ component, properties }, entity) => {
  Object.entries(properties).forEach(([key, value]) => {
    component[key][entity] = value
  })

  return entity
})
