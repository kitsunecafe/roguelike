import Kefir from 'https://esm.run/kefir'
import { divide, flip, subtract } from 'https://esm.run/ramda'

export const time$ = Kefir.stream((emitter) => {
  const update = (t) => {
    emitter.emit(t)
    id = requestAnimationFrame(update)
  }

  let id = requestAnimationFrame(update)

  return () => {
    cancelAnimationFrame(id)
  }
})

export const deltaTime$ = time$.diff(flip(subtract)).map(flip(divide)(1000))
