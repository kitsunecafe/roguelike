export default class Storage extends Array {
  constructor(maxSize = 128, initSize = 16) {
    super(initSize)
    this.maxSize = maxSize
    this._rm = []
    this._id = 1
  }

  _getNextID() {
    if (this._rm.length) {
      return this._rm.pop()
    } else if (this._id < this.maxSize) {
      return this._id++
    } else {
      throw new Error('StorageService: Too many values')
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
