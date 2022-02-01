import { not } from 'https://esm.run/wolf-ecs'
import { curry } from 'https://esm.run/ramda'
import { time$ } from '../arch/clock.js'
import * as World from '../arch/world.js'
import * as Vector from '../utils/math/vector.js'
import PositionKey from '../components/position.js'
import DisplacementKey from '../components/messages/displacement.js'
import FixedCollisionKey from '../components/messages/fixed-collision.js'
import DynamicCollisionKey from '../components/messages/dynamic-collision.js'
import { Impassable as ImpassableKey, Fixed as FixedKey } from '../components/tags.js'

export default ({ world }) => {
	const [
		Displacement,
		Position,
		FixedCollision,
		DynamicCollision,
		Impassable,
		Fixed,
	] = World.getComponent([
		DisplacementKey,
		PositionKey,
		FixedCollisionKey,
		DynamicCollisionKey,
		ImpassableKey,
		FixedKey
	],
		world
	)

	const staticEntities = world.createQuery(Position, Impassable, Fixed)

	const revertPosition = curry((collisionType, entity, other) => {
		Position.x[entity] = Displacement.px[entity]
		Position.y[entity] = Displacement.py[entity]
		world.removeComponent(entity, Displacement)

		World.withComponent(collisionType, { with: other }, world)
	})

	const revertFixed = revertPosition(FixedCollision)
	const revertDynamic = revertPosition(DynamicCollision)

	const getPosition = Vector.fromComponent(Position)
	const getDisp = Vector.fromComponent(Displacement)

	const eqPosition = (a, b) => Vector.eq(
		getPosition(a),
		getPosition(b)
	)

	time$.observe({
		value(input) {
			const movingEntities = world.createQuery(Position, Displacement)
			const dynamicEntities = world.createQuery(Position, Impassable, not(Fixed))

			movingEntities.forEach(a => {
				world.removeComponent(a, FixedCollision)
				world.removeComponent(a, DynamicCollision)

				staticEntities.forEach(b => {
					if (eqPosition(a, b)) {
						revertFixed(a, b)
					}
				})

				dynamicEntities.forEach(b => {
					if (a === b) return

					if (eqPosition(a, b)) {
						revertDynamic(a, b)
					}
				})

				// Entity "bumps"
				movingEntities.forEach(b => {
					if (a === b) return

					const posA = getPosition(a)

					const posB = getPosition(b)
					const dispB = getDisp(b)

					if (Vector.eq(posA, posB) || Vector.eq(posA, dispB)) {
						revertDynamic(a, b)
					}
				})

			})
		}
	})
}
