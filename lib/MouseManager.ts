import {View} from './View'
import {Point} from './geometry'
import type {
  MouseDownEvent,
  MouseEventListener,
  MouseEventListenerName,
  MouseEventName,
  MouseEventTarget,
  SystemMouseEvent,
} from './events'
import {isMouseButton, isMouseWheel} from './events'

function mouseKey(x: number, y: number, event: string) {
  return `${x},${y}:${event}`
}

export class MouseManager {
  #mouseListeners: Map<string, MouseEventListener> = new Map()
  #mouseMoveViews: MouseEventTarget[] = []
  #mouseDownEvent: MouseDownEvent | undefined

  reset() {
    this.#mouseListeners = new Map()
  }

  /**
   * Multiple views can claim the mouse.move event; they will all receive it.
   * Only the last view to claim button or wheel events will receive those events.
   */
  registerMouse(
    view: View,
    offset: Point,
    point: Point,
    eventNames: MouseEventListenerName[],
  ) {
    const resolved = offset.offset(point)
    for (const eventName of eventNames) {
      const key = mouseKey(resolved.x, resolved.y, eventName)
      const target = {
        view,
        offset,
      } as const
      const listener = this.#mouseListeners.get(key) ?? {move: []}
      if (eventName === 'mouse.move') {
        listener.move.unshift(target)
        this.#mouseListeners.set(key, listener)
      } else if (eventName.startsWith('mouse.button.') && !listener.button) {
        listener.button = target
        this.#mouseListeners.set(key, listener)
      } else if (eventName === 'mouse.wheel' && !listener.wheel) {
        listener.wheel = target
        this.#mouseListeners.set(key, listener)
      }
    }
  }

  getMouseListener(x: number, y: number, event: MouseEventListenerName) {
    return this.#mouseListeners.get(mouseKey(x, y, event))
  }

  trigger(systemEvent: SystemMouseEvent): void {
    if (systemEvent.name === 'mouse.move.in' && this.#mouseDownEvent) {
      return this.trigger({
        ...systemEvent,
        name: 'mouse.button.up',
        button: this.#mouseDownEvent.button,
      })
    }

    if (this.#mouseDownEvent) {
      if (!isMouseButton(systemEvent)) {
        return
      }
      this.#dragMouse(systemEvent, this.#mouseDownEvent)

      if (systemEvent.name === 'mouse.button.up') {
        this.#moveMouse(systemEvent)
      }
    } else if (isMouseButton(systemEvent)) {
      this.#pressMouse(systemEvent)
    } else if (isMouseWheel(systemEvent)) {
      this.#scrollMouse(systemEvent)
    } else {
      this.#moveMouse(systemEvent)
    }
  }

  #getListener(systemEvent: SystemMouseEvent): MouseEventTarget | undefined {
    return this.#getListeners(systemEvent)?.[0]
  }

  #getListeners(systemEvent: SystemMouseEvent): MouseEventTarget[] | undefined {
    let listener: MouseEventListener | undefined
    for (const eventName of checkEventNames(systemEvent)) {
      listener = this.getMouseListener(systemEvent.x, systemEvent.y, eventName)
      if (listener) {
        if (isMouseButton(systemEvent)) {
          return listener.button ? [listener.button] : undefined
        } else if (isMouseWheel(systemEvent)) {
          return listener.wheel ? [listener.wheel] : undefined
        } else {
          return listener.move
        }
      }
    }
    return undefined
  }

  #sendMouse(
    systemEvent: Omit<SystemMouseEvent, 'name'>,
    eventName: MouseEventName,
    target: MouseEventTarget,
  ) {
    const event = {
      ...systemEvent,
      name: eventName,
      x: systemEvent.x - target.offset.x,
      y: systemEvent.y - target.offset.y,
    }
    target.view.receiveMouse(event)
  }

  #dragMouse(systemEvent: SystemMouseEvent, mouseDown: MouseDownEvent) {
    if (systemEvent.name === 'mouse.button.up') {
      this.#mouseDownEvent = undefined
    }

    const {target} = mouseDown
    if (!target) {
      return
    }

    const isInside = this.#getListener(systemEvent)?.view === target.view
    if (systemEvent.name === 'mouse.button.up') {
      if (isInside) {
        this.#sendMouse(systemEvent, 'mouse.button.up', target)
      } else {
        this.#sendMouse(systemEvent, 'mouse.button.cancel', target)
      }
    } else {
      if (isInside && target.wasInside) {
        this.#sendMouse(systemEvent, 'mouse.button.drag', target)
      } else if (isInside) {
        this.#sendMouse(systemEvent, 'mouse.button.enter', target)
      } else if (target.wasInside) {
        this.#sendMouse(systemEvent, 'mouse.button.exit', target)
      } else {
        this.#sendMouse(systemEvent, 'mouse.button.dragOutside', target)
      }

      target.wasInside = isInside
      this.#mouseDownEvent = {...mouseDown, target}
    }
  }

  #pressMouse(systemEvent: SystemMouseEvent) {
    const listener = this.#getListener(systemEvent)
    if (listener) {
      this.#sendMouse(systemEvent, 'mouse.button.down', listener)
      this.#mouseDownEvent = {
        target: {view: listener.view, offset: listener.offset, wasInside: true},
        button: systemEvent.button,
      }
    }
  }

  #scrollMouse(systemEvent: SystemMouseEvent) {
    const listener = this.#getListener(systemEvent)
    if (listener) {
      this.#sendMouse(systemEvent, systemEvent.name, listener)
    }
  }

  #moveMouse(systemEvent: SystemMouseEvent) {
    const listeners = this.#getListeners(systemEvent) ?? []
    let prevListeners = this.#mouseMoveViews
    let index = 0
    for (const listener of listeners) {
      let didEnter = true
      prevListeners = prevListeners.filter(prev => {
        if (prev.view === listener.view) {
          didEnter = false
          return false
        }
        return true
      })

      if (didEnter) {
        this.#sendMouse(systemEvent, 'mouse.move.enter', listener)
      }

      if (index === 0) {
        this.#sendMouse(systemEvent, 'mouse.move.in', listener)
      } else {
        this.#sendMouse(systemEvent, 'mouse.move.below', listener)
      }

      index += 1
    }
    this.#mouseMoveViews = listeners

    for (const listener of prevListeners) {
      this.#sendMouse(systemEvent, 'mouse.move.exit', listener)
    }
  }
}

function checkEventNames(
  systemEvent: SystemMouseEvent,
): MouseEventListenerName[] {
  switch (systemEvent.name) {
    case 'mouse.move.in':
      return ['mouse.move']
    case 'mouse.button.down':
    case 'mouse.button.up':
      return [`mouse.button.${systemEvent.button}`, 'mouse.button.all']
    case 'mouse.wheel.down':
    case 'mouse.wheel.up':
      return ['mouse.wheel']
  }
}
