import { assoc, bind, curry, join, lensProp, over, pipe, replace, tap, update } from 'https://esm.run/rambda'

export const init = curry((width, height) => ({ width, height, buffer: new Array(width * height) }))

export const fillBuffer = curry((value, { buffer, ...display }) => ({
	...display,
	buffer: buffer.fill(value)
}))

export const attach = curry((container, display) => pipe(
	tap(bind(container.append, container)),
	assoc('container', container)
)(display))

const getCoord = curry((i, width) => ([i % width, Math.floor(i / width)]))
const index = curry((x, y, width) => x + width * y)
const getData = curry((x, y, { buffer, width }) => indexOf(index(x, y, width), buffer))

export const draw = curry((x, y, value, display) =>
	over(
		lensProp('buffer'),
		update(index(x, y, display.width), value),
		display
	)
)

export const render = tap(({ container, buffer, width }) => {
	container.innerHTML = pipe(
		join(''),
		replace(new RegExp(`(.{${width}})`, 'g'), '$1<br />')
	)(buffer)
})
