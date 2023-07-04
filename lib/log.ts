import {EventEmitter} from 'events'

const methods = [
  'debug',
  'dir',
  'error',
  'info',
  'log',
  'table',
  'warn',
] as const
export type Method = (typeof methods)[number]
export type Listener = (method: Method, args: any[]) => void

const log: [(typeof console)[Method], any[]][] = []
const listeners: Listener[] = []
let emitter: EventEmitter | null = null

export function interceptConsoleLog() {
  methods.forEach(method => {
    const builtin = console[method]
    console[method] = function () {
      const args = [...arguments]
      if (emitter && method !== 'debug') {
        emitter.emit('log', [method, args])
      } else {
        log.push([builtin, args])
      }
    }
  })
}

export function flushLogs() {
  log.forEach(([builtin, args]) => {
    builtin.apply(console, args)
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
