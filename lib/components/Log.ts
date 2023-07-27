import {unicode} from '../sys'

import {fetchLogs, type Level, LogLine} from '../log'
import {centerPad} from '../util'
import {styled} from '../ansi'
import {Viewport} from '../Viewport'
import {View, type Props as ViewProps} from '../View'

import {Container} from '../Container'
import {Text} from './Text'
import {ScrollableList} from './ScrollableList'
import {Collapsible} from './Collapsible'
import {Flow} from './Flow'
import {CollapsibleText} from './CollapsibleText'

export class Log extends Container {
  #logs: LogLine[] = []
  #viewMemo: WeakMap<LogLine, LogLineView> = new WeakMap()
  #scrollableList = new ScrollableList({
    scrollHeight: 10,
    cellAtIndex: (index) => {
      if (index >= this.#logs.length) {
        return
      }

      const log = this.#logs[index]
      let memo = this.#viewMemo.get(log)
      if (!memo) {
        memo = new LogLineView(log)
        this.#viewMemo.set(log, memo)
      }
      return memo
    },
    cellCount: () => this.#logs.length,
    keepAtBottom: true,
  })

  constructor(viewProps: ViewProps = {}) {
    super(viewProps)

    this.add(this.#scrollableList)
  }

  setLogs(logs: LogLine[]) {
    this.#logs = logs
    this.#scrollableList.invalidateAllRows('view')
  }

  appendLog(log: LogLine) {
    this.#logs.push(log)
  }

  clear() {
    this.#logs = []
  }
}

interface LogLineViewProps {
  level: Level
  args: any[]
}

class LogLineView extends Container {
  constructor({level, args}: LogLineViewProps) {
    super({})
    const header =
      styled(centerPad(level.toUpperCase(), 7), 'black fg;white bg')
    const lines = args.flatMap((arg) => {
      return `${arg}`.split('\n').map((line) => {
        return line
      })
    })

    let logView: View
    const [firstLine, ..._] = lines
    if (lines.length > 1) {
      logView = new Collapsible({
        isCollapsed: true,
        collapsedView: new Text({
          text: firstLine,
          wrap: false,
        }),
        expandedView: new Text({
          lines: lines,
          wrap: true,
        }),
      })
    } else {
      logView = new CollapsibleText({
        text: firstLine,
      })
    }

    this.add(
      new Flow({
        direction: 'leftToRight',
        spaceBetween: 1,
        children: [
          new Text({
            text: header,
            wrap: false,
          }),
          logView
        ]
      })
    )
  }

}

export class ConsoleLog extends Log {
  render(viewport: Viewport) {
    fetchLogs().forEach((log) => this.appendLog(log))
    super.render(viewport)
  }
}
