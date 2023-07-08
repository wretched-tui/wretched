import type {BlessedProgram} from './sys'
import {program as blessedProgram} from './sys'
import {SGRTerminal} from './terminal'
import {Viewport} from './Viewport'
import {View} from './View'
import {Rect, Point, Size} from './geometry'
import {flushLogs} from './log'
import {Buffer} from './Buffer'
import type {
  MouseButton,
  MouseDownEvent,
  MouseEventListener,
  MouseEventListenerName,
  MouseEventName,
  MouseEventTarget,
  SystemEvent,
  SystemMouseEvent,
  SystemMouseEventName,
} from './events'
import {isMouseButton, isMouseWheel} from './events'

export class Screen {
  terminal: SGRTerminal
  buffer: Buffer
  view: View
  #viewport?: Viewport
  #mouseMoveViews: MouseEventTarget[] = []
  #mouseDownEvent: MouseDownEvent | undefined

  static start(viewConstructor: () => View): [Screen, BlessedProgram] {
    const program = blessedProgram({
      useBuffer: true,
    })

    program.alternateBuffer()
    program.enableMouse()
    program.hideCursor()
    program.clear()
    program.setMouse({sendFocus: true}, true)

    const view = viewConstructor()
    const screen = new Screen(program, view)

    const refresh = setInterval(() => {
      screen.render()
    }, 16)

    program.on('focus' as any, function () {
      screen.trigger({type: 'focus'})
    })

    program.on('blur' as any, function () {
      screen.trigger({type: 'blur'})
    })

    program.on('resize', function () {
      screen.render()
    })

    program.on('keypress', (char, key) => {
      if (key.name === 'c' && key.ctrl) {
        clearInterval(refresh)

        program.clear()
        program.disableMouse()
        program.showCursor()
        program.normalBuffer()
        flushLogs()
        process.exit(0)
      } else {
        screen.trigger({type: 'key', ...key})
      }
    })

    program.on('mouse', function (data) {
      let action = data.action
      if (action === 'focus' || action === 'blur') {
        return
      }
      if (data.button === 'unknown') {
        return
      }

      screen.trigger({
        ...data,
        name: translateMouseAction(action, data.button),
        type: 'mouse',
      })
      screen.render()
    })

    screen.render()

    return [screen, program]
  }
  coords: [number, number, string][] = []

  constructor(terminal: SGRTerminal, view: View) {
    this.terminal = terminal
    this.buffer = new Buffer()
    this.view = view
    view.moveToScreen(this)
  }

  trigger(event: SystemEvent) {
    switch (event.type) {
      case 'focus':
      case 'blur':
      case 'key':
        break
      case 'mouse':
        this.triggerMouse(event)
    }
  }

  timerId: ReturnType<typeof setTimeout> | undefined
  render() {
    if (this.timerId === undefined) {
      this.#render()
    } else {
      clearTimeout(this.timerId)
      this.timerId = setTimeout(this.#render.bind(this), 8)
    }
  }

  #render() {
    const screenSize = new Size(this.terminal.cols, this.terminal.rows)
    this.buffer.resize(screenSize)

    const size = this.view.intrinsicSize(screenSize)

    const viewport = new Viewport(this.buffer, size, new Rect(Point.zero, size))
    this.view.render(viewport)
    this.buffer.flush(this.terminal)

    this.#viewport = viewport
  }

  triggerMouse(systemEvent: SystemMouseEvent): void {
    if (systemEvent.name === 'mouse.move.in' && this.#mouseDownEvent) {
      return this.triggerMouse({
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
      listener = this.#viewport?.getMouseListener(
        systemEvent.x,
        systemEvent.y,
        eventName,
      )
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

function translateMouseAction(
  action: 'mousemove' | 'mousedown' | 'mouseup' | 'wheeldown' | 'wheelup',
  button: MouseButton,
): SystemMouseEventName {
  switch (action) {
    case 'mousemove':
      return 'mouse.move.in'
    case 'mousedown':
      return `mouse.button.down`
    case 'mouseup':
      return `mouse.button.up`
    case 'wheeldown':
      return 'mouse.wheel.down'
    case 'wheelup':
      return 'mouse.wheel.up'
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
