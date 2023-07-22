import {inspect} from './inspect'

const inspect_methods = ['debug', 'error', 'info', 'log', 'warn'] as const
const methods = [...inspect_methods, 'dir', 'table'] as const
export type Method = (typeof methods)[number]
export type Listener = (method: Method, args: any[]) => void

let logs: [Method, any[]][] = []

const builtin: any = {}
methods.forEach(method => {
  builtin[method] = console[method]
})

export function interceptConsoleLog() {
  methods.forEach(method => {
    console[method] = function () {
      const args = [...arguments].map(arg => inspect(arg, true))
      appendLog([method, args])
    }
  })
}

function appendLog([method, args]: [Method, any[]]) {
  logs.push([method, args])
}

export function fetchLogs() {
  const copy = logs
  logs = []
  return copy
}

export function flushLogs() {
  logs.forEach(([method, args]) => {
    builtin[method].apply(console, args)
  })
  logs.splice(0, logs.length)
  methods.forEach(method => {
    console[method] = builtin[method]
  })
}
