import {program, colors} from './sys'

export type Color =
  // 'default' background will fallback to either the pen color, or if the
  // background has been assigned previously, that will be preserved.
  | 'default' // -1
  | 'black' // 0
  | 'red' // 1
  | 'green' // 2
  | 'yellow' // 3
  | 'blue' // 4
  | 'magenta' // 5
  | 'cyan' // 6
  | 'white' // 7
  | 'gray' // 8
  | 'grey' // 9
  | 'brightRed' // 10
  | 'brightGreen' // 11
  | 'brightYellow' // 12
  | 'brightBlue' // 13
  | 'brightMagenta' // 14
  | 'brightCyan' // 15
  | 'brightWhite' // 16
  // SGR color 0-255
  // fg: 38;5;0-255
  // bg: 48;5;0-255
  // 0-15 are "classic" terminal colors
  // 16-231 are RGB colors
  // r: 0-5, g: 0-5, b: 0-5
  // sgr = 16 + r * 36 + g * 6 + b
  // 232-255 are grayscale (232=black, 255=white)
  | {sgr: string | number}
  // 0 - 255, these get mapped to the closest SGR color
  | [r: number, g: number, b: number]
  // 00-FF, also get mapped to the closest SGR color
  | `#${string}`

export function colorToHex(color: Color): `#${string}` {
  if (Array.isArray(color)) {
    return colors.RGBToHex(color)
  } else if (typeof color === 'string' && color.startsWith('#')) {
    return color as `#${string}`
  } else if (typeof color === 'object') {
    return colors.indexToHex(+color.sgr)
  } else {
    const index = colors.nameToIndex(color)
    return index === -1 ? '#ffffff' : colors.indexToHex(index)
  }
}

export function colorToSGR(color: Color, fgbg: 'fg' | 'bg'): string {
  if (Array.isArray(color)) {
    return `${colors.RGBToHex(color)} ${fgbg}`
  } else if (typeof color === 'object') {
    return `${color.sgr} ${fgbg}`
  } else {
    return `${color} ${fgbg}`
  }
}

export const RESET = '\x1b[0m'

export function styled(input: string, attr: string) {
  return program.global?.text(input, attr) ?? input
}

export function style(attr: string) {
  if (attr.startsWith('\x1b[')) {
    return attr
  }
  return program.global?.style(attr) ?? ''
}

export function ansi(code: number, input: string) {
  const opener = '\x1b['.concat(String(code), 'm')
  return opener.concat(input.replace(RESET, opener), RESET)
}

export function bold(input: string) {
  return program.global?.text(input, 'bold') ?? ansi(1, input)
}

export function underline(input: string) {
  return program.global?.text(input, 'underline') ?? ansi(4, input)
}

export function red(input: string) {
  return program.global?.text(input, 'red fg') ?? ansi(31, input)
}

export function green(input: string) {
  return program.global?.text(input, 'green fg') ?? ansi(32, input)
}

export function yellow(input: string) {
  return program.global?.text(input, 'yellow fg') ?? ansi(33, input)
}

export function blue(input: string) {
  return program.global?.text(input, 'blue fg') ?? ansi(34, input)
}

export function cyan(input: string) {
  return program.global?.text(input, 'cyan fg') ?? ansi(36, input)
}

export function gray(input: string) {
  return program.global?.text(input, 'gray fg') ?? ansi(90, input)
}

export const colorize = {
  format: function (input: any): string {
    switch (typeof input) {
      case 'string':
        return colorize.string(input)
      case 'number':
        return colorize.number(input)
      case 'undefined':
        return colorize.undefined()
      case 'object':
        return colorize['null']()
      default:
        return `${input}`
    }
  },
  number: function (input: any) {
    return yellow(''.concat(input))
  },
  string: function (input: any, doQuote: boolean = true) {
    let quote: string
    if (doQuote) {
      if (input.includes("'")) {
        quote = '"'
        input = input.replaceAll('"', '\\"')
      } else {
        quote = "'"
        input = input.replaceAll("'", "\\'")
      }
    } else {
      quote = ''
    }
    input.replace(/\n/g, '\\n')

    return green(quote.concat(input, quote))
  },
  key: function (input: any) {
    return cyan(input)
  },
  boolean: function (input: any) {
    return yellow(''.concat(input))
  },
  undefined: function () {
    return gray('undefined')
  },
  null: function () {
    return bold('null')
  },
}
