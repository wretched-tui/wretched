import {program} from './sys'

import type {Color} from './Color'
import {colorToSGR} from './Color'

type Nullable<T> = {[K in keyof T]?: null | undefined | T[K]}

export class Style {
  bold?: boolean
  dim?: boolean
  italic?: boolean
  strikeout?: boolean
  underline?: boolean
  inverse?: boolean
  blink?: boolean
  invisible?: boolean
  foreground?: Color
  background?: Color

  static NONE = new Style()
  static underlined = new Style({underline: true})
  static bold = new Style({bold: true})

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
        case '2':
          style.dim = true
          break
        case '22':
          style.bold = false
          style.dim = false
          break
        case '3':
          style.italic = true
          break
        case '23':
          style.italic = false
          break
        case '4':
          style.underline = true
          break
        case '24':
          style.underline = false
          break
        case '5':
          style.blink = true
          break
        case '25':
          style.blink = false
          break
        case '7':
          style.inverse = true
          break
        case '27':
          style.inverse = false
          break
        case '8':
          style.invisible = true
          break
        case '28':
          style.invisible = false
          break
        case '9':
          style.strikeout = true
          break
        case '29':
          style.strikeout = false
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
    bold,
    dim,
    italic,
    strikeout,
    underline,
    inverse,
    blink,
    invisible,
    foreground,
    background,
  }: {
    underline?: boolean
    inverse?: boolean
    bold?: boolean
    dim?: boolean
    italic?: boolean
    strikeout?: boolean
    blink?: boolean
    invisible?: boolean
    foreground?: Color
    background?: Color
  } = {}) {
    this.underline = underline
    this.inverse = inverse
    this.bold = bold
    this.dim = dim
    this.italic = italic
    this.strikeout = strikeout
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

  merge(style?: Nullable<Style>): Style {
    if (style === undefined) {
      return this
    }

    return new Style({
      underline: style.underline ?? this.underline,
      inverse: style.inverse ?? this.inverse,
      bold: style.bold ?? this.bold,
      dim: style.dim ?? this.dim,
      italic: style.italic ?? this.italic,
      strikeout: style.strikeout ?? this.strikeout,
      blink: style.blink ?? this.blink,
      invisible: style.invisible ?? this.invisible,
      foreground:
        style.foreground === null
          ? undefined
          : style.foreground === undefined
          ? this.foreground
          : style.foreground,
      background:
        style.background === null
          ? undefined
          : style.background === undefined
          ? this.background
          : style.background,
    })
  }

  isEqual(style: Style) {
    return (
      this.underline === style.underline &&
      this.inverse === style.inverse &&
      this.bold === style.bold &&
      this.dim === style.dim &&
      this.italic === style.italic &&
      this.strikeout === style.strikeout &&
      this.blink === style.blink &&
      this.invisible === style.invisible &&
      this.foreground === style.foreground &&
      this.background === style.background
    )
  }

  toDebug() {
    return (
      [
        ['bold', this.bold],
        ['dim', this.dim],
        ['italic', this.italic],
        ['strikeout', this.strikeout],
        ['underline', this.underline],
        ['inverse', this.inverse],
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

    if (this.dim && !prevStyle.dim) {
      parts.push('dim')
    } else if (!this.dim && prevStyle.dim) {
      parts.push('!dim')
    }

    if (this.italic && !prevStyle.italic) {
      parts.push('italic')
    } else if (!this.italic && prevStyle.italic) {
      parts.push('!italic')
    }

    if (this.strikeout && !prevStyle.strikeout) {
      parts.push('strikeout')
    } else if (!this.strikeout && prevStyle.strikeout) {
      parts.push('!strikeout')
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
