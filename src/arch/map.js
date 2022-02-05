import Babylon from 'https://esm.run/babylonjs@5.0.0-beta.6'
import { last } from 'https://esm.run/ramda'

const halfPI = Math.PI / 2

const toCoord2D = (index, width) => (
	[index % width, Math.floor(index / width)]
)

const toCoord3D = (index, width, height) => (
	[
		index % width,
		Math.floor(index / width) % height,
		Math.floor(index / (width * height))
	]
)

const toIndex2D = (x, y, w) => x * w + y
const toIndex3D = (x, y, z, w, h) => x + w * y + w * h * z

export const create = (renderer, tiles) => {
	const options = { width: 100, height: 100, updatable: true }

	const wallMat = new Babylon.StandardMaterial('wall material', renderer.scene)
	wallMat.diffuseTexture = new Babylon.Texture('static/textures/stone_diffuse.png', renderer.scene)
	wallMat.bumpTexture = new Babylon.Texture('static/textures/stone_bump.png', renderer.scene)

	const floorMat = new Babylon.StandardMaterial('floor material', renderer.scene)
	floorMat.diffuseTexture = new Babylon.Texture('static/textures/floor_diffuse.png', renderer.scene)
	floorMat.bumpTexture = new Babylon.Texture('static/textures/floor_bump.png', renderer.scene)

	const pxg = Babylon.MeshBuilder.CreatePlane('px', options)
	pxg.material = wallMat
	pxg.rotate(Babylon.Axis.Y, -halfPI)
	pxg.position.x = -50

	const nxg = Babylon.MeshBuilder.CreatePlane('nx', options)
	nxg.material = wallMat
	nxg.rotation.y = halfPI
	nxg.position.x = 50

	const pzg = Babylon.MeshBuilder.CreatePlane('pz', options)
	pzg.material = wallMat
	pzg.position.z = -50
	pzg.rotation.y = Math.PI

	const nzg = Babylon.MeshBuilder.CreatePlane('nz', options)
	nzg.material = wallMat
	nzg.position.z = 50

	const pyg = Babylon.MeshBuilder.CreatePlane('py', options)
	pyg.material = floorMat
	pyg.rotation.x = halfPI
	pyg.position.y = -50

	const lastTile = last(tiles)

	const width = lastTile.x + 1
	const depth = lastTile.y + 1

	const halfWidth = width / 2
	const halfDepth = depth / 2

	let meshes = []

	const get = (x, y) => {
		const tile = tiles[toIndex2D(x, y, depth)]
		if (tile) return tile.value
		else return 1
	}
	const add = (m, i, t) => {
		const clone = m.clone(`${m.name}-${i}`).translate(t, 1, Babylon.Space.WORLD)
		meshes.push(clone)
	}

	for (let i = 0; i < tiles.length; i++) {
		const { x, y: z, value: current } = tiles[i]

		const translation = new Babylon.Vector3(
			x * 100 - halfWidth * 100,
			0,
			z * 100 - halfDepth * 100
		)

		const px = get(x - 1, z)
		const nx = get(x + 1, z)
		const pz = get(x, z - 1)
		const nz = get(x, z + 1)

		const isEmpty = current === 0
		if (isEmpty) add(pyg, i, translation)
		if ((isEmpty && px === 1) || x === 0) add(pxg, i, translation)
		if ((isEmpty && nx === 1) || x === width - 1) add(nxg, i, translation)
		if ((isEmpty && pz === 1) || z === 0) add(pzg, i, translation)
		if ((isEmpty && nz === 1) || z === depth - 1) add(nzg, i, translation)
	}

	const mesh = Babylon.Mesh.MergeMeshes(meshes, true, false, null, false, true)
	mesh.checkCollisions = true

	pxg.dispose()
	nxg.dispose()
	pyg.dispose()
	pzg.dispose()
	nzg.dispose()

	return {
		mesh,
		renderer
	}
}

export const createPointLight = (position, map) => ({
	...map,
	lights: append(
		new Babylon.PointLight('light', position, this.map.renderer.scene),
		map.lights
	)
})
