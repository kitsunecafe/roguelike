import Kefir from 'https://esm.run/kefir'

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
