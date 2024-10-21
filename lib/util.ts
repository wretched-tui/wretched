import {unicode} from './sys'

let _debug = false
/**
 * A global function to turn debugging on/off, useful to test things that would
 * otherwise output way too much, ie console in render()
 */
export function debug(value?: boolean): boolean {
  return (_debug = value ?? _debug)
}

export function leftPad(str: string, length: number): string {
  const lines = str.split('\n')
  if (lines.length > 1) {
    return lines.map(line => leftPad(line, length)).join('\n')
  }
  const width = unicode.lineWidth(str)
  if (width >= length) {
    return str
  }

  return ' '.repeat(length - width).concat(str)
}

export function rightPad(str: string, length: number): string {
  const lines = str.split('\n')
  if (lines.length > 1) {
    return lines.map(line => rightPad(line, length)).join('\n')
  }
  const width = unicode.lineWidth(str)
  if (width >= length) {
    return str
  }

  return str.concat(' '.repeat(length - width))
}

export function centerPad(str: string, length: number): string {
  const lines = str.split('\n')
  if (lines.length > 1) {
    return lines.map(line => centerPad(line, length)).join('\n')
  }
  const width = unicode.lineWidth(str)
  if (width >= length) {
    return str
  }

  const left = ' '.repeat(~~((length - width) / 2))
  const right = ' '.repeat(~~((length - width) / 2 + 0.5))
  return left.concat(str, right)
}
