export default class StringService extends Array {
  constructor(maxSize = 128, initSize = 16) {
    super(initSize)
    this.maxSize = maxSize
    this._rm = []
    this._id = 0
  }

  _getNextID() {
    if (this._rm.length) {
      return this._rm.pop()
    } else if (this._id < this.maxSize) {
      return this._id++
    } else {
      throw new Error('StringService: Too many stored values')
    }
  }

  add(value) {
    const id = this._getNextID()
    this[id] = value
    return id
  }

  remove(id) {
    this._rm.push(id)
  }
}
