import Babylon from 'https://esm.run/babylonjs@5.0.0-beta.6'
import { curryN, tap } from 'https://esm.run/ramda'

export const init = curryN(4, (scene, name, opts, type) => ({
	mesh: new Babylon.MeshBuilder[`Create${type}`](name, opts, scene),
	physics: false
}))

export const fromMesh = mesh => ({
	mesh,
	physics: mesh.checkCollisions
})

export const withPhysics = curryN(2, (enabled, { mesh, ...rest }) => {
	mesh.checkCollisions = enabled
	mesh.applyGravity = enabled

	return {
		...rest,
		mesh,
		physics: enabled
	}
})

export const setEllipsoid = curryN(2, (vec, obj) => tap(o => o.mesh.ellipsoid = vec, obj))
export const setParent = curryN(2, (parent, obj) => tap(o => o.mesh.parent = parent.mesh, obj))
export const setPosition = curryN(2, (vec, obj) => tap(o => o.mesh.position = vec, obj))
