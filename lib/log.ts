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
  levels.forEach(level => {
    console[level] = function () {
      const args = [...arguments].map(arg => inspect(arg, true))
      appendLog({level, args})
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
