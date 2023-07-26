import {unicode} from '../sys'

import type {Method} from '../log'
import {fetchLogs} from '../log'
import {centerPad} from '../util'
import {inspect} from '../inspect'
import {styled} from '../ansi'
import {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'

import {Container} from '../Container'
import {Text} from './Text'
import {ScrollableList} from './ScrollableList'

export class ConsoleLog extends Container {
  #logs: [Method, any[]][] = []
  #scrollableList = new ScrollableList({
    scrollHeight: 10,
    cellAtIndex: index => {
      if (index < 0) {
        index = this.#logs.length + (index % this.#logs.length)
      }
      if (index >= this.#logs.length) {
        return
      }
      return new LogLine(this.#logs[index][0], this.#logs[index][1])
    },
    cellCount: () => this.#logs.length,
    keepAtBottom: true,
  })
  constructor(viewProps: ViewProps = {}) {
    super(viewProps)

    this.add(this.#scrollableList)
  }

  setLogs(logs: [Method, any[]][]) {
    this.#logs = logs
    this.#scrollableList.invalidateAllRows()
  }

  appendLog(method: Method, args: any[]) {
    if (method === 'dir') {
    } else if (method === 'table') {
    } else {
      this.#logs.push([method, args])
    }
  }

  clear() {
    this.#logs = []
  }

  render(viewport: Viewport) {
    // fetchLogs().forEach(([method, args]) => this.appendLog(method, args))
    super.render(viewport)
  }
}

class LogLine extends Text {
  constructor(method: Method, args: any[]) {
    const header =
      styled(centerPad(method.toUpperCase(), 7), 'black fg;white bg') + ' '
    const spaces = ' '.repeat(unicode.lineWidth(header))
    const lines = args.flatMap((arg, index) => {
      return `${arg}`.split('\n').map((line, lineIndex) => {
        if (index === 0 && lineIndex === 0) {
          return header + line
        } else {
          return spaces + line
        }
      })
    })

    super({lines, wrap: true})
  }
}
