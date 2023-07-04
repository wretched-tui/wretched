import {program} from './sys'

export const RESET = '\x1b[0m'

export function styled(input: string, attr: string) {
  return program.global?.text(input, attr) ?? input
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
