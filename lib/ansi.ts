import {program, colors} from './sys'

export class Style {
  // SGR 1
  underline?: boolean
  // SGR 4
  inverse?: boolean
  // SGR 5
  bold?: boolean
  // SGR 7
  blink?: boolean
  // SGR 8
  invisible?: boolean
  foreground: Color = 'default'
  background: Color = 'default'

  static NONE = new Style()

  constructor({
    underline,
    inverse,
    bold,
    blink,
    invisible,
    foreground,
    background,
  }: {
    underline?: boolean
    inverse?: boolean
    bold?: boolean
    blink?: boolean
    invisible?: boolean
    foreground?: Color
    background?: Color
  } = {}) {
    this.underline = underline
    this.inverse = inverse
    this.bold = bold
    this.blink = blink
    this.invisible = invisible
    this.foreground = foreground ?? this.foreground
    this.background = background ?? this.background
  }

  invert(): Style {
    const style = new Style().merge(this)
    style.foreground = this.background
    style.background = this.foreground
    return style
  }

  merge(style: Style): this {
    this.underline = this.underline ?? style.underline
    this.inverse = this.inverse ?? style.inverse
    this.bold = this.bold ?? style.bold
    this.blink = this.blink ?? style.blink
    this.invisible = this.invisible ?? style.invisible

    if (this.foreground === 'default') {
      this.foreground = style.foreground
    }

    return this.mergeBackground(style)
  }

  mergeBackground(style: Style): this {
    if (this.background === 'default') {
      this.background = style.background
    }

    return this
  }

  isEqual(style: Style) {
    return (
      this.underline === style.underline &&
      this.inverse === style.inverse &&
      this.bold === style.bold &&
      this.blink === style.blink &&
      this.invisible === style.invisible &&
      this.foreground === style.foreground &&
      this.background === style.background
    )
  }

  toSGR() {
    const {global: globalProgram} = program
    if (!globalProgram) {
      return ''
    }

    const parts: string[] = []
    if (this.underline) {
      parts.push('underline')
    }
    if (this.bold) {
      parts.push('bold')
    }
    if (this.inverse) {
      parts.push('inverse')
    }
    if (this.foreground) {
      parts.push(toSGR(this.foreground, 'fg'))
    }
    if (this.background) {
      parts.push(toSGR(this.background, 'bg'))
    }
    return globalProgram.style(parts.join(';'))
  }
}

export type Color = 
  | 'default'
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'brightRed'
  | 'brightGreen'
  | 'brightYellow'
  | 'brightBlue'
  | 'brightMagenta'
  | 'brightCyan'
  | 'brightWhite'
  // SGR color 0-255
  // fg: 38;5;0-255
  // bg: 48;5;0-255
  // 0-15 are "classic" terminal colors
  // 16-231 are RGB colors
  // r: 0-5, g: 0-5, b: 0-5
  // sgr = 16 + r * 36 + g * 6 + b
  // 232-255 are grayscale (232=black, 255=white)
  | {sgr: string}
  // 0 - 255, these get mapped to the closest SGR color
  | [r: number, g: number, b: number]
  // 00-FF, also get mapped to the closest SGR color
  | `#${string}`

export function toSGR(color: Color, fgbg: 'fg' | 'bg'): string {
  if (Array.isArray(color)) {
    return `${colors.RGBToHex(color)} ${fgbg}`
  } else if (typeof color === 'object') {
    return `${color.sgr} ${fgbg}`
  } else {
    return `${color} ${fgbg}`
  }
}

export function fromSGR(ansi: string): Style {
  let match = ansi.match(/^\x1b\[([\d;]*)m$/)
  if (!match) {
    return Style.NONE
  }
  ansi = match[1] + ';'
  let ansiCodes: string[] = []
  let code = ''
  for (const char of ansi) {
    if (char === ';') {
      if (
        code === '38' ||
        code === '38;5' ||
        code === '48' ||
        code === '48;5'
      ) {
        code += ';'
      } else {
        ansiCodes.push(code)
        code = ''
      }
    } else {
      code += char
    }
  }

  let style = new Style()
  for (const code of ansiCodes) {
    if ((match = code.match(/^38;5;(\d+)$/))) {
      style.foreground = {sgr: match[1]}
      continue
    } else if ((match = code.match(/^48;5;(\d+)$/))) {
      style.background = {sgr: match[1]}
      continue
    }

    switch (code) {
      case '':
        break
      case '1':
        style.bold = true
        break
      case '4':
        style.underline = true
        break
      case '5':
        style.blink = true
        break
      case '7':
        style.inverse = true
        break
      case '8':
        style.invisible = true
        break
      case '30':
        style.foreground = 'black'
        break
      case '31':
        style.foreground = 'red'
        break
      case '32':
        style.foreground = 'green'
        break
      case '33':
        style.foreground = 'yellow'
        break
      case '34':
        style.foreground = 'blue'
        break
      case '35':
        style.foreground = 'magenta'
        break
      case '36':
        style.foreground = 'cyan'
        break
      case '37':
        style.foreground = 'white'
        break
      case '39':
        style.foreground = 'default'
        break
      case '90':
        style.foreground = 'gray'
        break
      case '91':
        style.foreground = 'brightRed'
        break
      case '92':
        style.foreground = 'brightGreen'
        break
      case '93':
        style.foreground = 'brightYellow'
        break
      case '94':
        style.foreground = 'brightBlue'
        break
      case '95':
        style.foreground = 'brightMagenta'
        break
      case '96':
        style.foreground = 'brightCyan'
        break
      case '97':
        style.foreground = 'brightWhite'
        break
      case '40':
        style.background = 'black'
        break
      case '41':
        style.background = 'red'
        break
      case '42':
        style.background = 'green'
        break
      case '43':
        style.background = 'yellow'
        break
      case '44':
        style.background = 'blue'
        break
      case '45':
        style.background = 'magenta'
        break
      case '46':
        style.background = 'cyan'
        break
      case '47':
        style.background = 'white'
        break
      case '49':
        style.background = 'default'
        break
      case '100':
        style.background = 'gray'
        break
      case '101':
        style.background = 'brightRed'
        break
      case '102':
        style.background = 'brightGreen'
        break
      case '103':
        style.background = 'brightYellow'
        break
      case '104':
        style.background = 'brightBlue'
        break
      case '105':
        style.background = 'brightMagenta'
        break
      case '106':
        style.background = 'brightCyan'
        break
      case '107':
        style.background = 'brightWhite'
        break
    }
  }
  return style
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
