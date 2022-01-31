import { time$ } from '../arch/clock.js'
import PositionComponent from '../components/position.js'
import RenderableComponent from '../components/renderable.js'

export default ({ world, display }) => {
  const Renderable = world.components.get(RenderableComponent)
  const Position = world.components.get(PositionComponent)
  const services = world.services
  const stringStorage = services.get('string')

  time$.observe({
    value() {
      const renderableQuery = world.createQuery(Renderable, Position)

      renderableQuery.forEach((entity) => {
        display.draw(
          Position.x[entity],
          Position.y[entity],
          stringStorage[Renderable.glyph[entity]]
        )
      })

      display.render()
    }
  })
}
