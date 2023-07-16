import type {BlessedProgram} from './sys'
import {program as blessedProgram} from './sys'
import {SGRTerminal} from './terminal'
import {Viewport} from './Viewport'
import {View} from './View'
import {Rect, Point, Size} from './geometry'
import {flushLogs} from './log'
import {Buffer} from './Buffer'
import type {
  KeyEvent,
  MouseEventListenerName,
  SystemEvent,
  SystemMouseEvent,
  SystemMouseEventName,
} from './events'
import {FocusManager} from './FocusManager'
import {MouseManager} from './MouseManager'
import {TickManager} from './TickManager'

export class Screen {
  program: SGRTerminal
  buffer: Buffer
  view: View
  #focusManager = new FocusManager()
  #mouseManager = new MouseManager()
  #tickManager = new TickManager(() => this.render())

  static async start(
    viewConstructor: View | ((program: BlessedProgram) => View | Promise<View>),
  ): Promise<[Screen, BlessedProgram]> {
    const program = blessedProgram({
      useBuffer: true,
    })

    program.alternateBuffer()
    program.enableMouse()
    program.hideCursor()
    program.clear()
    program.setMouse({sendFocus: true}, true)

    const fn = function () {}
    program.on('keypress', fn)

    const view =
      viewConstructor instanceof View
        ? viewConstructor
        : await viewConstructor(program)
    const screen = new Screen(program, view)
    program.off('keypress', fn)

    program.on('focus', function () {
      screen.trigger({type: 'focus'})
    })

    program.on('blur', function () {
      screen.trigger({type: 'blur'})
    })

    program.on('resize', function () {
      screen.trigger({type: 'resize'})
    })

    program.on('keypress', (char, key) => {
      if (key.name === 'c' && key.ctrl) {
        program.clear()
        program.disableMouse()
        program.showCursor()
        program.normalBuffer()
        screen.exit()
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
        name: translateMouseAction(action),
        type: 'mouse',
      })
    })

    screen.start()

    return [screen, program]
  }

  constructor(program: SGRTerminal, view: View) {
    this.program = program
    this.buffer = new Buffer()
    this.view = view
  }

  start() {
    this.view.moveToScreen(this)
    this.render()
  }

  exit() {
    this.#tickManager.stop()
    this.view.moveToScreen(null)
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
        break
    }
    this.render()
  }

  registerTick(view: View) {
    this.#tickManager.registerTick(view)
  }

  triggerTick(dt: number) {}

  registerFocus(view: View) {
    this.#focusManager.registerFocus(view)
  }

  triggerKeyboard(event: KeyEvent) {
    event = translateKeyEvent(event)
    this.#focusManager.trigger(event)
  }

  hasFocus(view: View) {
    return this.#focusManager.hasFocus(view)
  }

  // nextFocus() {
  //   this.#focusManager.nextFocus()
  // }

  /**
   * @see MouseManager.registerMouse
   */
  registerMouse(
    view: View,
    offset: Point,
    point: Point,
    eventNames: MouseEventListenerName[],
  ) {
    this.#mouseManager.registerMouse(view, offset, point, eventNames)
  }

  triggerMouse(systemEvent: SystemMouseEvent): void {
    this.#mouseManager.trigger(systemEvent)
  }

  render() {
    const screenSize = new Size(this.program.cols, this.program.rows)
    this.buffer.resize(screenSize)

    this.#tickManager.reset()
    this.#mouseManager.reset()
    this.#focusManager.reset()

    const size = this.view.calculateIntrinsicSize(screenSize).max(screenSize)
    const viewport = new Viewport(
      this,
      this.buffer,
      size,
      new Rect(Point.zero, size),
    )

    this.view.render(viewport)

    const focusNeedsRender = this.#focusManager.needsRerender()
    const mouseNeedsRender = this.#mouseManager.needsRender()

    // one -and only one- re-render if a change is detected to focus or mouse-hover
    if (focusNeedsRender || mouseNeedsRender) {
      this.view.render(viewport)
    }

    this.#tickManager.endRender()

    this.buffer.flush(this.program)
  }
}

function translateMouseAction(
  action: 'mousemove' | 'mousedown' | 'mouseup' | 'wheeldown' | 'wheelup',
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

/**
 * These are mostly due to my own terminal keybindings; would be better to have
 * these configured in some .rc file.
 */
function translateKeyEvent(event: KeyEvent): KeyEvent {
  if (event.full === 'M-b') {
    return {
      type: 'key',
      full: 'M-left',
      name: 'left',
      ctrl: false,
      meta: true,
      shift: false,
      char: '1;9D',
    }
  }
  if (event.full === 'M-f') {
    return {
      type: 'key',
      full: 'M-right',
      name: 'right',
      ctrl: false,
      meta: true,
      shift: false,
      char: '1;9C',
    }
  }
  return event
}
