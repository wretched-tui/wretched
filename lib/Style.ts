import {program} from './sys'

import type {Color} from './Color'
import {colorToSGR} from './Color'

export class Style {
  underline?: boolean
  inverse?: boolean
  bold?: boolean
  blink?: boolean
  invisible?: boolean
  foreground?: Color
  background?: Color

  static NONE = new Style()
  static underlined = new Style({underline: true})

  static fromSGR(ansi: string): Style {
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
    this.foreground = foreground
    this.background = background
  }

  invert(): Style {
    return this.merge({
      foreground: this.background,
      background: this.foreground,
    })
  }

  merge(style?: Partial<Style>): Style {
    if (style === undefined) {
      return this
    }

    return new Style({
      underline: style.underline ?? this.underline,
      inverse: style.inverse ?? this.inverse,
      bold: style.bold ?? this.bold,
      blink: style.blink ?? this.blink,
      invisible: style.invisible ?? this.invisible,
      foreground:
        style.foreground === undefined || style.foreground === 'default'
          ? this.foreground
          : style.foreground,
      background:
        style.background === undefined || style.background === 'default'
          ? this.background
          : style.background,
    })
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

  toDebug() {
    return (
      [
        ['underline', this.underline],
        ['inverse', this.inverse],
        ['bold', this.bold],
        ['blink', this.blink],
        ['invisible', this.invisible],
        ['foreground', this.foreground],
        ['background', this.background],
      ] as const
    )
      .filter(([name, value]) => value !== undefined)
      .reduce((o: any, [name, value]) => {
        o[name] = value
        return o
      }, {} as any)
  }

  /**
   * @param prevStyle Used by the buffer to reset foreground/background colors and attrs
   */
  toSGR(prevStyle: Style) {
    const {global: globalProgram} = program
    if (!globalProgram) {
      return ''
    }

    const parts: string[] = []
    if (this.underline && !prevStyle.underline) {
      parts.push('underline')
    } else if (!this.underline && prevStyle.underline) {
      parts.push('!underline')
    }

    if (this.bold && !prevStyle.bold) {
      parts.push('bold')
    } else if (!this.bold && prevStyle.bold) {
      parts.push('!bold')
    }

    if (this.inverse && !prevStyle.inverse) {
      parts.push('inverse')
    } else if (!this.inverse && prevStyle.inverse) {
      parts.push('!inverse')
    }

    if (this.foreground) {
      parts.push(colorToSGR(this.foreground, 'fg'))
    } else if (prevStyle.foreground && prevStyle.foreground !== 'default') {
      parts.push(colorToSGR('default', 'fg'))
    }

    if (this.background) {
      parts.push(colorToSGR(this.background, 'bg'))
    } else if (prevStyle.background && prevStyle.background !== 'default') {
      parts.push(colorToSGR('default', 'bg'))
    }

    return globalProgram.style(parts.join(';'))
  }
}
