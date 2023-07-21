import {View} from '../View'
import {Point} from '../geometry'
import type {
  MouseDownEvent,
  MouseEventListener,
  MouseEventListenerName,
  MouseEventName,
  MouseEventTarget,
  SystemMouseEvent,
} from '../events'
import {isMouseButton, isMouseWheel} from '../events'

function mouseKey(x: number, y: number) {
  return `${~~x},${~~y}`
}

export class MouseManager {
  #prevListener?: MouseEventListener
  #mouseListeners: Map<string, MouseEventListener> = new Map()
  #mouseMoveViews: MouseEventTarget[] = []
  #mouseDownEvent: MouseDownEvent | undefined
  #mousePosition?: Point

  reset() {
    if (this.#mouseDownEvent || !this.#mousePosition) {
      this.#prevListener = undefined
    } else {
      this.#prevListener = this.getMouseListener(
        this.#mousePosition.x,
        this.#mousePosition.y,
      )
    }
    this.#mouseListeners = new Map()
  }

  needsRender() {
    if (this.#mouseDownEvent || !this.#mousePosition) {
      return false
    }

    const listener = this.getMouseListener(
      this.#mousePosition.x,
      this.#mousePosition.y,
    )
    const prev = new Set(
      this.#prevListener?.move.map(target => target.view) ?? [],
    )
    const next = new Set(listener?.move.map(target => target.view) ?? [])
    let same = prev.size === next.size
    if (same) {
      for (const view of prev) {
        if (!next.has(view)) {
          same = false
          break
        }
      }
    }

    if (!same) {
      this.trigger({
        type: 'mouse',
        name: 'mouse.move.in',
        button: 'unknown',
        ctrl: false,
        meta: false,
        shift: false,
        ...this.#mousePosition,
      })
    }
    return !same
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
      const key = mouseKey(resolved.x, resolved.y)
      const target = {
        view,
        offset,
      } as const
      const listener = this.#mouseListeners.get(key) ?? {move: []}
      if (eventName === 'mouse.move') {
        // search listener.move - only keep views that are in the current views
        // ancestors
        listener.move.unshift(target)
      } else if (eventName.startsWith('mouse.button.')) {
        switch (eventName) {
          case 'mouse.button.left':
            listener.buttonLeft = target
            break
          case 'mouse.button.middle':
            listener.buttonMiddle = target
            break
          case 'mouse.button.right':
            listener.buttonRight = target
            break
          case 'mouse.button.all':
            listener.buttonAll = target
            break
        }
      } else if (eventName === 'mouse.wheel') {
        listener.wheel = target
      }
      this.#mouseListeners.set(key, listener)
    }
  }

  checkMouse(view: View, x: number, y: number) {
    function foo(view: any) {
      return view.constructor.name === 'Button'
        ? {name: view.constructor.name, text: (view as any).text}
        : view.constructor.name
    }

    const debug = x === 25 && y === 5
    const listener = this.getMouseListener(x, y)
    if (!listener) {
      return
    }

    const ancestors = new Set<View>([view])
    for (let parent = view.parent; !!parent; parent = parent!.parent) {
      ancestors.add(parent)
    }

    ;(
      [
        'buttonAll',
        'buttonLeft',
        'buttonMiddle',
        'buttonRight',
        'wheel',
      ] as const
    ).forEach(prop => {
      const target = listener[prop]
      if (!target) {
        return
      }
      listener[prop] = ancestors.has(target.view) ? target : undefined
    })
    listener.move = listener.move.filter(({view}) => ancestors.has(view))

    this.#mouseListeners.set(mouseKey(x, y), listener)
  }

  getMouseListener(x: number, y: number) {
    return this.#mouseListeners.get(mouseKey(x, y))
  }

  trigger(systemEvent: SystemMouseEvent): void {
    this.#mousePosition = new Point(systemEvent.x, systemEvent.y)

    if (systemEvent.name === 'mouse.move.in' && this.#mouseDownEvent) {
      return this.trigger({
        ...systemEvent,
        name: 'mouse.button.up',
        button: this.#mouseDownEvent.button,
      })
    }

    if (this.#mouseDownEvent) {
      // ignore scroll wheel
      if (!isMouseButton(systemEvent)) {
        return
      }
      this.#dragMouse(systemEvent, this.#mouseDownEvent)

      if (systemEvent.name === 'mouse.button.up') {
        this.#moveMouse({...systemEvent, name: 'mouse.move.in'})
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
    return this.#getListeners(systemEvent)[0]
  }

  #getListeners(systemEvent: SystemMouseEvent): MouseEventTarget[] {
    const listener = this.getMouseListener(systemEvent.x, systemEvent.y)
    if (!listener) {
      return []
    }

    if (isMouseButton(systemEvent)) {
      let target: MouseEventTarget | undefined
      switch (systemEvent.button) {
        case 'left':
          target = listener.buttonLeft ?? listener.buttonAll
          break
        case 'middle':
          target = listener.buttonMiddle ?? listener.buttonAll
          break
        case 'right':
          target = listener.buttonRight ?? listener.buttonAll
          break
        default:
          return []
      }

      return target ? [target] : []
    } else if (isMouseWheel(systemEvent)) {
      return listener.wheel ? [listener.wheel] : []
    } else {
      return listener.move
    }
  }

  #sendMouse(
    systemEvent: Omit<SystemMouseEvent, 'name'>,
    eventName: MouseEventName,
    target: MouseEventTarget,
  ) {
    const event = {
      ...systemEvent,
      name: eventName,
      position: target.offset.offset(systemEvent.x, systemEvent.y),
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
    const listeners = this.#getListeners(systemEvent)
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
