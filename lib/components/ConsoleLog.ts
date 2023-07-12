import {unicode} from '../sys'

import type {Method} from '../log'
import {fetchLogs} from '../log'
import {centerPad} from '../util'
import {inspect} from '../inspect'
import {styled} from '../ansi'
import {Viewport} from '../Viewport'

import {Flow} from './Flow'
import {Text} from './Text'

export class ConsoleLog extends Flow {
  constructor() {
    super({direction: 'topToBottom', children: []})
  }

  appendLog(method: Method, args: any[]) {
    if (method === 'dir') {
    } else if (method === 'table') {
    } else {
      if (this.children.length < 1000) {
        this.add(new LogLine(method, args))
      } else if (this.children.length === 1000) {
        this.add(new LogLine(method, ['UH OH']), 0)
      }
    }
  }

  clear() {
    for (const child of [...this.children]) {
      this.remove(child)
    }
  }

  render(viewport: Viewport) {
    fetchLogs().forEach(([method, args]) => this.appendLog(method, args))
    viewport.registerMouse(this, 'mouse.wheel')
    super.render(viewport)
  }
}

class LogLine extends Text {
  constructor(method: Method, args: any[]) {
    const header =
      styled(centerPad(method.toUpperCase(), 7), 'black fg;white bg') + ' '
    const lines = args.flatMap(arg => {
      return inspect(arg, false)
        .split('\n')
        .map((line, index) => {
          if (index === 0) {
            return header + line
          } else {
            return ' '.repeat(unicode.lineWidth(header)) + line
          }
        })
    })

    super({lines, wrap: true})
  }
}
