import {inspect} from './inspect'

const levels = ['debug', 'error', 'info', 'log', 'warn'] as const
export type Level = (typeof levels)[number]
export type Listener = (level: Level, args: any[]) => void
export interface LogLine {
  level: Level
  args: any[]
}
let logs: LogLine[] = []

const builtin: any = {}
levels.forEach(level => {
  builtin[level] = console[level]
})

export function interceptConsoleLog() {
  decorateConsoleLog()

  levels.forEach(level => {
    console[level] = function (...args) {
      appendLog({level, args})
    }
  })
}

export function decorateConsoleLog() {
  levels.forEach(level => {
    const log = console[level]
    if ((log as any).isDecorated) {
      return
    }
    ;(log as any).isDecorated = true

    console[level] = function (...args) {
      log(...args.map(arg => inspect(arg, true)))
    }
  })
}

function appendLog(log: LogLine) {
  logs.push(log)
}

export function fetchLogs() {
  const copy = logs
  logs = []
  return copy
}

export function flushLogs() {
  logs.forEach(({level, args}) => {
    builtin[level].apply(console, args)
  })
  logs.splice(0, logs.length)
  levels.forEach(level => {
    console[level] = builtin[level]
  })
}
