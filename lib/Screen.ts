import {EventEmitter} from 'events'

import type {BlessedProgram} from './sys'
import {program as blessedProgram} from './sys'
import {SGRTerminal} from './terminal'
import {Viewport} from './Viewport'
import {View} from './View'
import {Rect, Point, Size} from './geometry'
import {flushLogs, stopLogEmitter} from './log'
import {Buffer} from './Buffer'
import type {
  KeyEvent,
  MouseButton,
  MouseEventListenerName,
  SystemEvent,
  SystemMouseEvent,
  SystemMouseEventName,
} from './events'
import {MouseManager} from './MouseManager'
import type {Opaque} from './opaque'

type Listener<T extends 'start' | 'exit'> = Opaque<T>

export class Screen {
  program: SGRTerminal
  buffer: Buffer
  view: View
  #viewport?: Viewport
  #mouseManager = new MouseManager()

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

    program.on('focus' as any, function () {
      screen.trigger({type: 'focus'})
    })

    program.on('blur' as any, function () {
      screen.trigger({type: 'blur'})
    })

    program.on('resize', function () {
      screen.trigger({type: 'resize'})
    })

    program.on('keypress', (char, key) => {
      if (key.name === 'c' && key.ctrl) {
        stopLogEmitter()
        screen.exit(program)
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
    })

    screen.start(program)

    return [screen, program]
  }

  static #emitter = new EventEmitter()

  static on<T extends 'start' | 'exit'>(
    event: T,
    listener: (program: BlessedProgram) => void,
  ): Listener<T> {
    Screen.#emitter.on(event, listener)
    return listener as unknown as Listener<T>
  }

  static off<T extends 'start' | 'exit'>(event: T, listener: Listener<T>) {
    Screen.#emitter.off(event, listener as any)
  }

  static emit(event: 'start' | 'exit', program: BlessedProgram) {
    Screen.#emitter.emit(event, program)
  }

  constructor(program: SGRTerminal, view: View) {
    this.program = program
    this.buffer = new Buffer()
    this.view = view
  }

  #refresh?: ReturnType<typeof setInterval>
  start(program: BlessedProgram) {
    // this.#refresh = setInterval(() => {
    //   this.render()
    // }, 16)
    this.view.moveToScreen(this)
    Screen.#emitter.emit('start', program)
    this.render()
  }

  exit(program: BlessedProgram) {
    if (this.#refresh) {
      clearInterval(this.#refresh)
    }

    this.view.moveToScreen(null)
    Screen.#emitter.emit('exit', program)
  }

  trigger(event: SystemEvent) {
    switch (event.type) {
      case 'resize':
      case 'focus':
      case 'blur':
        break
      case 'key':
        this.triggerKeyboard(event)
        break
      case 'mouse':
        this.triggerMouse(event)
    }
    this.render()
  }

  triggerKeyboard(event: KeyEvent) {
    console.log('=========== Screen.ts at line 147 ===========')
    console.log({'event.type': event})
    if (event.name === 'tab') {
      this.#prevFocus = this.#viewport?.nextFocus()
    } else {
    }
  }

  #prevFocus: View | undefined
  render() {
    const screenSize = new Size(this.program.cols, this.program.rows)
    this.buffer.resize(screenSize)
    this.#mouseManager.reset()

    const size = this.view.intrinsicSize(screenSize)

    const viewport = new Viewport(
      this,
      this.buffer,
      size,
      new Rect(Point.zero, size),
    )
    viewport.focus = this.#prevFocus
    this.view.render(viewport)
    this.#prevFocus = viewport.focus
    this.buffer.flush(this.program)

    this.#viewport = viewport
  }

  triggerMouse(systemEvent: SystemMouseEvent): void {
    this.#mouseManager.trigger(systemEvent)
  }

  assignMouse(
    view: View,
    offset: Point,
    point: Point,
    eventNames: MouseEventListenerName[],
  ) {
    this.#mouseManager.assignMouse(view, offset, point, eventNames)
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
