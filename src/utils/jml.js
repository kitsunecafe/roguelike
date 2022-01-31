// https://idiallo.com/javascript/create-dom-elements-faster
import curry from 'https://esm.run/crocks/helpers/curry'
const startsWith = curry((str, val) => str.startsWith(val))
const toEventName = name => name.slice(2).toLowerCase()

const addEventListener = curry((el, name, fn) => el.addEventListener(
	toEventName(name),
	fn,
	false
))

export default function ml(tagName, props = {}, nest) {
	const el = document.createElement(tagName)
	const startsWithOn = startsWith('on')
	const attachEvent = addEventListener(el)

	Object.entries(props).forEach(([key, value]) => (
		startsWithOn(key) ? attachEvent(key, value) : el.setAttribute(key, value)
	))

	return !nest ? el : nester(el, nest)
}

function nester(el, n) {
	if (typeof n === "string") {
		const t = document.createTextNode(n)
		el.appendChild(t)
	} else if (n instanceof Array) {
		for (let i = 0; i < n.length; i++) {
			if (typeof n[i] === "string") {
				const t = document.createTextNode(n[i])
				el.appendChild(t)
			} else if (n[i] instanceof Node) {
				el.appendChild(n[i])
			}
		}
	} else if (n instanceof Node) {
		el.appendChild(n)
	}
	return el
}