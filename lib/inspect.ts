import {inspect as nodeInspect} from 'util'
import {colorize, red} from './ansi'

let _debug = false
export function isDebugging(enabled?: boolean) {
  if (enabled !== undefined) {
    _debug = enabled
  }
  return _debug
}

export function inspect(value: any, wrap: boolean = true, recursion = 0): string {
  if (recursion >= 10) {
    return red('...')
  }

  if (value instanceof Set) {
    return `new Set(${inspect(Array.from(value.values()), wrap, recursion)})`
  }

  if (value instanceof Map) {
    return `new Map(${inspect(value.entries(), wrap, recursion)})`
  }

  const tab = '  '.repeat(recursion)
  const innerTab = tab + '  '

  if (value instanceof Object && value.constructor !== Object && Object.keys(value).length === 0) {
    return nodeInspect(value).replace('\n', `\n${innerTab}`)
  } else if (typeof value === 'string') {
    return colorize.string(value, recursion > 0)
  } else if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === undefined ||
    value === null
  ) {
    return colorize.format(value)
  } else if (typeof value === 'function') {
    return `function${value.name ? ` ${value.name}` : ''}() {…}`
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]'
    }

    const values = value.map(val => inspect(val, wrap, recursion + 1))
    const count = values.reduce((len, val) => len + val.length, 0)
    const newline = wrap && count > 100
    let inner: string
    if (newline) {
      inner = values.join(`,\n${innerTab}`)
    } else {
      inner = values.join(', ')
    }

    return newline ? `[\n${innerTab}${inner}\n${tab}]` : `[ ${inner} ]`
  }

  const name =
    value.constructor === undefined
      ? ''
      : value.constructor.name === 'Object'
      ? ''
      : value.constructor.name.concat(' ')
  const keys = Object.keys(value)
  if (keys.length === 0) {
    return '{}'
  }

  const values = keys.map(
    key => `${colorize.key(key)}: ${inspect(value[key], wrap, recursion + 1)}`,
  )
  const count = values.reduce((len, val) => len + val.length, 0)
  const newline = wrap && count > 100
  let inner: string
  if (newline) {
    inner = values.join(`,\n${innerTab}`)
  } else {
    inner = values.join(', ')
  }

  return newline ? `${name}{\n${innerTab}${inner}\n${tab}}` : `${name}{ ${inner} }`
}
