import type {MouseButton} from '../sys'
import {View} from '../View'
import {Point} from '../geometry'

// export namespace Screen {
//   export type MouseEvent = Omit<WretchedMouseEvent, 'action' | 'name'> & {
//     type: 'mouse'
//     action: 'mousemove' | 'mousedown' | 'mouseup' | 'wheeldown' | 'wheelup'
//   }
// }

export type MouseMove = 'enter' | 'in' | 'below' | 'exit'
export type MouseClick =
  | 'down'
  | 'enter'
  | 'drag'
  | 'up'
  | 'exit'
  | 'dragOutside'
  | 'cancel'
export type MouseWheel = 'down' | 'up'

export type MouseEventListenerName =
  | 'mouse.move'
  | 'mouse.button.all'
  | `mouse.button.${MouseButton}`
  | 'mouse.wheel'
export type SystemMouseEventName =
  | 'mouse.move.in'
  | 'mouse.button.down'
  | 'mouse.button.up'
  | 'mouse.wheel.down'
  | 'mouse.wheel.up'
export type MouseEventName =
  | `mouse.move.${MouseMove}`
  | `mouse.button.${MouseClick}`
  | `mouse.wheel.${MouseWheel}`
export type MouseEvent = {
  x: number
  y: number
  type: 'mouse'
  name: MouseEventName
  ctrl: boolean
  meta: boolean
  shift: boolean
  button: MouseButton
}

export type SystemMouseEvent = Omit<MouseEvent, 'name'> & {
  name: SystemMouseEventName
}
export type MouseDownEvent = {
  target?: MouseEventTarget & {wasInside: boolean}
  button: MouseButton
}
export type MouseEventTarget = {
  view: View
  offset: Point
}
export type MouseEventListener = {
  move: MouseEventTarget[]
  button?: MouseEventTarget
  wheel?: MouseEventTarget
}

export function isMousePressed(event: SystemMouseEvent | MouseEvent) {
  return (
    event.name.startsWith('mouse.button.') &&
    ['down', 'enter', 'drag'].some(suffix => event.name.endsWith(suffix))
  )
}

export function isMouseReleased(event: SystemMouseEvent | MouseEvent) {
  return (
    event.name.startsWith('mouse.button.') &&
    ['up', 'exit', 'cancel'].some(suffix => event.name.endsWith(suffix))
  )
}

export function isMouseDragging(event: SystemMouseEvent | MouseEvent) {
  return (
    event.name.startsWith('mouse.button.') &&
    ['.up', '.cancel'].every(suffix => !event.name.endsWith(suffix))
  )
}

export function isMouseEnter(event: MouseEvent) {
  return event.name.endsWith('.enter')
}

export function isMouseExit(event: MouseEvent) {
  return event.name.endsWith('.exit')
}

export function isMouseButton(event: SystemMouseEvent | MouseEvent) {
  return event.name.startsWith('mouse.button.')
}

export function isMouseWheel(event: SystemMouseEvent | MouseEvent) {
  return event.name.startsWith('mouse.wheel.')
}

export function isMouseMove(event: SystemMouseEvent | MouseEvent) {
  return event.name.startsWith('mouse.move.')
}
