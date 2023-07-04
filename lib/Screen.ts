import type {BlessedProgram} from './sys'
import {program as blessedProgram} from './sys'
import {Terminal} from './types'
import {Viewport} from './Viewport'
import {View} from './View'
import {Rect, Point, Size} from './geometry'
import {flushLogs} from './log'
import {Buffer} from './Buffer'

export class Screen {
  terminal: Terminal
  buffer: Buffer
  view: View

  static start(view: () => View): [Screen, BlessedProgram] {
    const program = blessedProgram({
      useBuffer: true,
    })

    program.alternateBuffer()
    program.enableMouse()
    program.hideCursor()
    program.clear()

    const screen = new Screen(program, view())

    program.key('C-c', function () {
      program.clear()
      program.disableMouse()
      program.showCursor()
      program.normalBuffer()
      flushLogs()
      process.exit(0)
    })

    let timerId: ReturnType<typeof setTimeout> | undefined
    program.on('resize', function (data) {
      if (timerId !== undefined) {
        clearTimeout(timerId)
      }

      timerId = setTimeout(() => screen.render(), 8)
    })

    program.on('mouse', function (data) {
      if (timerId !== undefined) {
        clearTimeout(timerId)
      }

      timerId = setTimeout(() => screen.render(), 8)
    })

    screen.render()

    return [screen, program]
  }
  coords: [number, number, string][] = []

  constructor(terminal: Terminal, view: View) {
    this.terminal = terminal
    this.buffer = new Buffer()
    this.view = view
    view.didMount()
  }

  render() {
    const screenSize = new Size(this.terminal.cols, this.terminal.rows)
    this.buffer.clear(screenSize)

    const size = this.view.intrinsicSize(screenSize)

    const viewport = new Viewport(this.buffer, size, new Rect(Point.zero, size))
    this.view.render(viewport)
    this.buffer.flush(this.terminal)
  }
}
