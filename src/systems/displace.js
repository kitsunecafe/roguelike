import { time$ } from '../arch/clock.js'
import * as World from '../arch/world.js'
import PositionKey from '../components/position.js'
import DisplacementKey from '../components/messages/displacement.js'

export default ({ world }) => {
	const [Displacement, Position] = World.getComponent([
		DisplacementKey,
		PositionKey
	],
		world
	)

	time$.observe({
		value(input) {
			const dispQuery = world.createQuery(Displacement, Position)

			dispQuery.forEach((entity) => {
				Position.x[entity] += Displacement.x[entity]
				Position.y[entity] += Displacement.y[entity]

				world.removeComponent(entity, Displacement)
			})
		}
	})
}
