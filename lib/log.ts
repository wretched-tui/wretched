import {EventEmitter} from 'events'
import {inspect} from './inspect'

const inspect_methods = ['debug', 'error', 'info', 'log', 'warn'] as const
const methods = [...inspect_methods, 'dir', 'table'] as const
export type Method = (typeof methods)[number]
export type Listener = (method: Method, args: any[]) => void

const log: [Method, any[]][] = []
const listeners: Listener[] = []
let emitter: EventEmitter | null = null

const builtin: any = {}
methods.forEach(method => {
  builtin[method] = console[method]
})

export function interceptConsoleLog() {
  methods.forEach(method => {
    console[method] = function () {
      const args = [...arguments]
      if (emitter && method !== 'debug') {
        emitter.emit('log', [method, args])
      } else {
        appendLog([method, args])
      }
    }
  })
}

function appendLog([method, args]: [Method, any[]]) {
  if ((inspect_methods as readonly string[]).includes(method)) {
    log.push([method, args.map(arg => inspect(arg, false))])
  } else {
    log.push([method, args])
  }
}

export function stopLogEmitter() {
  emitter = new EventEmitter()
  emitter.on('log', appendLog)
}

export function flushLogs() {
  log.forEach(([method, args]) => {
    builtin[method].apply(console, args)
  })
  log.splice(0, log.length)
}

function emit([method, args]: [Method, any[]]) {
  for (const listener of listeners) {
    listener(method, args)
  }
}

export function subscribe(fn: Listener) {
  if (listeners.length === 0) {
    emitter = new EventEmitter()
    emitter.on('log', emit)
  }
  listeners.push(fn)
}

export function unsubscribe(fn: Listener) {
  const index = listeners.indexOf(fn)
  if (index > -1) {
    listeners.splice(index, 1)

    if (listeners.length === 0) {
      emitter!.off('log', emit)
      emitter = null
    }
  }
}
