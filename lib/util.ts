import {Size} from './geometry'
import {unicode} from './sys'

export function strSize(str: string | string[]): Size {
  if (Array.isArray(str)) {
    return new Size(Math.max(...str.map(unicode.strWidth)), str.length)
  } else {
    if (str.includes('\n')) {
      return strSize(str.split('\n'))
    }
    return new Size(unicode.strWidth(str), 1)
  }
}

export function leftPad(str: string, length: number): string {
  const lines = str.split('\n')
  if (lines.length > 1) {
    return lines.map(line => leftPad(line, length)).join('\n')
  }
  const width = unicode.strWidth(str)
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
  const width = unicode.strWidth(str)
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
  const width = unicode.strWidth(str)
  if (width >= length) {
    return str
  }

  const left = ' '.repeat(~~((length - width) / 2))
  const right = ' '.repeat(~~((length - width) / 2 + 0.5))
  return left.concat(str, right)
}
