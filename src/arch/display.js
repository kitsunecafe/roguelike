import ml from '../utils/jml.js'

export default class Display extends Array {
  constructor(width, height) {
    super(width * height)
    this.width = width
    this.height = height
    this.element = ml('pre', { class: 'display' })
  }

  attach(container) {
    if (this.container) {
      this.container.removeChild(this.element)
    }

    container.append(this.element)
    this.container = container

    return this
  }

  coord(i) {
    return [i % this.width, Math.floor(i / this.width)]
  }

  index(x, y) {
    return x + this.width * y
  }

  get(x, y) {
    return this[this.index(x, y)]
  }

  draw(x, y, value) {
    this[this.index(x, y)] = value
    return this
  }

  render() {
    this.element.innerHTML = this.join('').replace(
      new RegExp(`(.{${this.width}})`, 'g'),
      '$1<br />'
    )

    return this
  }
}
