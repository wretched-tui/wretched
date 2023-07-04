import {inspect as nodeInspect} from 'util'
import * as ansi from './ansi'

let _debug = false
export function isDebugging(enabled?: boolean) {
  if (enabled !== undefined) {
    _debug = enabled
  }
  return _debug
}

export function inspect(value: any, recursion = 0): string {
  if (value instanceof Set) {
    return `new Set(${inspect(Array.from(value.values()), recursion)})`
  }

  if (value instanceof Map) {
    return `new Map(${inspect(value.entries(), recursion)})`
  }

  const tab = '  '.repeat(recursion)
  const innerTab = tab + '  '

  if (value instanceof Object && value.constructor !== Object && Object.keys(value).length === 0) {
    return nodeInspect(value).replace('\n', `\n${innerTab}`)
  } else if (typeof value === 'string') {
    return ansi.colorize.string(value, recursion > 0)
  } else if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    value === null
  ) {
    return ansi.colorize.format(value)
  } else if (typeof value === 'function') {
    return `function${value.name ? ` ${value.name}` : ''}() {…}`
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]'
    }

    const values = value.map(val => inspect(val, recursion + 1))
    const count = values.reduce((len, val) => len + val.length, 0)
    const inner = values.join(', ')

    return `[ ${inner} ]`
  }

  const name = value.constructor.name === 'Object' ? '' : value.constructor.name.concat(' ')
  const keys = Object.keys(value)
  if (keys.length === 0) {
    return '{}'
  }

  const values = keys.map(key => `${ansi.colorize.key(key)}: ${inspect(value[key], recursion + 1)}`)
  const count = values.reduce((len, val) => len + val.length, 0)
  const inner = values.join(', ')

  return `${name}{ ${inner} }`
}
