import * as World from '../arch/world.js'
import { time$ } from '../arch/clock.js'
import PositionKey from '../components/position.js'
import RenderableKey from '../components/renderable.js'

export default ({ world, display }) => {
  const [Renderable, Position] = World.getComponent([
    RenderableKey,
    PositionKey
  ], world)

  const stringStorage = world.services.get('string')

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
