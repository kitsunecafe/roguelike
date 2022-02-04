import { time$ } from '../arch/clock.js'

export default ({ world, renderer }) => {
  time$.observe({
    value() {
      renderer.render()
    }
  })
}
