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

export class Log extends Container {
  #logs: LogLine[] = []
  #scrollableList = new ScrollableList({
    scrollHeight: 10,
    cellAtIndex: (index) => {
      if (index < 0) {
        index = this.#logs.length + (index % this.#logs.length)
      }
      if (index >= this.#logs.length) {
        return
      }
      const {level, args} = this.#logs[index]
      return new LogLineView({
        level,
        args,
        onLogClick: () => {
          this.#scrollableList.invalidateRow(index, 'size')
        }
      })
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
  onLogClick?: () => void
}

class LogLineView extends Container {
  constructor({level, args, onLogClick}: LogLineViewProps) {
    super({})
    const header =
      styled(centerPad(level.toUpperCase(), 7), 'black fg;white bg')
    const lines = args.flatMap((arg) => {
      return `${arg}`.split('\n').map((line) => {
        return line
      })
    })

    let logView: View
    if (lines.length > 1) {
      const [firstLine, ..._] = lines
      logView = new Collapsible({
        isCollapsed: true,
        onClick: onLogClick,
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
      logView = new Text({
        lines: lines,
        wrap: true,
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
