import { types } from 'https://esm.run/wolf-ecs'
import { defineComponent } from '../arch/ecs.js'

const component = defineComponent({
    x: types.u8,
    y: types.u8
})

export default (x, y) => ({ component, properties: { x, y }})
