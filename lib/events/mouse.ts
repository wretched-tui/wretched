import type {MouseButton} from '../sys'
import {View} from '../View'
import {Point} from '../geometry'

export type MouseMove =
  | 'enter' // mouse move enters area
  | 'in' // mouse moving inside
  | 'below' // mouse moving inside, but this is not the topmost view
  | 'exit' // mouse exiting
export type MouseClick =
  | 'down' // mouse down, inside target area
  | 'enter' // dragging from outside into area
  | 'drag' // dragging inside
  | 'up' // mouse released inside area
  | 'exit' // mouse dragged from inside to outside
  | 'dragOutside' // mouse dragged outside
  | 'cancel' // mouse released outside
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
  position: Point
  type: 'mouse'
  name: MouseEventName
  ctrl: boolean
  meta: boolean
  shift: boolean
  button: MouseButton
}

export type SystemMouseEvent = Omit<MouseEvent, 'name' | 'position'> & {
  name: SystemMouseEventName
  x: number
  y: number
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
  buttonAll?: MouseEventTarget
  buttonLeft?: MouseEventTarget
  buttonMiddle?: MouseEventTarget
  buttonRight?: MouseEventTarget
  wheel?: MouseEventTarget
}

export function isMouseClicked(event: MouseEvent) {
  return event.name === 'mouse.button.up'
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

export function isMouseButton(event: SystemMouseEvent) {
  return event.name.startsWith('mouse.button.')
}

export function isMouseWheel(event: SystemMouseEvent | MouseEvent) {
  return event.name.startsWith('mouse.wheel.')
}

export function isMouseMove(event: SystemMouseEvent | MouseEvent) {
  return event.name.startsWith('mouse.move.')
}
