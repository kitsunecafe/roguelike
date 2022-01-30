import { ECS } from 'https://esm./run/wolf-ecs'

export const ecs = new ECS()
const { createEntity, defineComponent } = ecs.bind()
export { createEntity, defineComponent }
// export const createEntity = ecs.createEntity

export const withComponent = ({ component, properties }, entity) => {
  Object.entries(properties).forEach(([key, value]) => {
    component[key][id] = value
  })

  return entity
}
