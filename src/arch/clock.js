import Kefir from 'https://esm.run/kefir'
import { flip, subtract } from 'https://esm.run/ramda'

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

export const deltaTime$ = time$.diff(flip(subtract))
