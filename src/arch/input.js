import Kefir from 'https://esm.run/kefir'
import * as Vector from '../utils/math/vector.js'
import { time$ } from './clock.js'

const fromKeyEvent = (ev) =>
  Kefir.fromEvents(document, ev).map((ev) => ev.keyCode)

export const keyDown$ = fromKeyEvent('keydown')
export const keyUp$ = fromKeyEvent('keyup')

export const observeKey = (key) =>
  Kefir.merge([
    keyDown$.filter((k) => k === key).map((_) => 1),
    keyUp$.filter((k) => k === key).map((_) => 0),
    Kefir.constant(0)
  ])

export const observeAxis = (pos, neg) =>
  Kefir.combine([observeKey(pos), observeKey(neg)], (x, y) => x - y)

export const observeVector = (xPos, xNeg, yPos, yNeg) =>
  Kefir.combine([observeAxis(xPos, xNeg), observeAxis(yPos, yNeg)], Vector.init)

export const Keys = {
  w: 87,
  s: 83,
  a: 65,
  d: 68
}

export const movement$ = observeVector(Keys.a, Keys.d, Keys.s, Keys.w)
  .sampledBy(time$)
  .throttle(25)
