import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Style} from '../Style'
import {Point, Size} from '../geometry'

interface Props extends ViewProps {
  text: string
  style?: Style
  bold?: boolean
}

type DigitName =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '*'
  | '#'
  | ':'
  | '!'
  | '.'
  | ','
  | ' '
type Digit = [number, string, string, string] | '\n'

export class Digits extends View {
  #text: string = ''
  #digits: Digit[] = []
  #bold: boolean = false
  #style: Props['style']
  declare text: string

  constructor(props: Props) {
    super(props)

    this.#update(props)

    Object.defineProperty(this, 'text', {
      enumerable: true,
      get: () => this.#text,
      set: (value: string) => {
        this.#updateNumber(value)
      },
    })
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({text, style, bold}: Props) {
    this.#style = style
    this.#bold = bold ?? false
    this.#updateNumber(text)
  }

  #updateNumber(value: string) {
    let filtered = ''
    this.#digits = value.split('').flatMap(c => {
      const upper = c.toUpperCase()
      const digits = this.#bold ? DIGITS_BOLD : DIGITS
      if (c === '\n') {
        filtered += c
        return [c]
      } else if (digits[c as DigitName]) {
        filtered += c
        return [digits[c as DigitName]]
      } else if (digits[upper as DigitName]) {
        filtered += upper
        return [digits[upper as DigitName]]
      } else {
        return []
      }
    })
    this.#text = filtered
  }

  naturalSize(): Size {
    const [width, height] = this.#digits.reduce(
      ([maxWidth, totalHeight, currentWidth], digit) => {
        if (digit === '\n') {
          return [maxWidth, totalHeight + 3, 0]
        }
        const [w] = digit
        const nextWidth = currentWidth + w
        return [Math.max(maxWidth, nextWidth), totalHeight, nextWidth]
      },
      [0, 3, 0],
    )
    return new Size(width, height)
  }

  render(viewport: Viewport) {
    if (viewport.isEmpty) {
      return
    }

    viewport.usingPen(this.#style, pen => {
      const point = new Point(0, 0).mutableCopy()
      for (const digit of this.#digits) {
        if (digit === '\n') {
          point.x = 0
          point.y += 3
          continue
        }

        const [width, ...lines] = digit
        let y = 0
        for (const line of lines) {
          viewport.write(line, point.offset(0, y++))
        }
        point.x += width
      }
    })
  }
}

// prettier-ignore
const DIGITS_BOLD: Record<DigitName, Digit> = {
  A: [
    3, // width
    '┏━┓',
    '┣━┫',
    '╹ ╹',
  ],
  B: [
    3,
    '┳━┓',
    '┣━┫',
    '┻━┛',
  ],
  C: [
    3,
    '┏━╸',
    '┃  ',
    '┗━╸',
  ],
  D: [
    3,
    '┳━┓',
    '┃ ┃',
    '┻━┛',
  ],
  E: [
    3,
    '┏━╸',
    '┣━ ',
    '┗━╸',
  ],
  F: [
    3,
    '┏━╸',
    '┣━ ',
    '╹  ',
  ],
  G: [
    3,
    '┏━╸',
    '┃╺┓',
    '┗━┛',
  ],
  H: [
    3,
    '╻ ╻',
    '┣━┫',
    '╹ ╹',
  ],
  I: [
    1,
    '┳',
    '┃',
    '┻',
  ],
  J: [
    2,
    ' ┳',
    ' ┃',
    '┗┛',
  ],
  K: [
    2,
    '╻▗',
    '┣▌',
    '╹▝',
  ],
  L: [
    3,
    '╻  ',
    '┃  ',
    '┗━╸',
  ],
  M: [
    3,
    '┏┳┓',
    '┃╹┃',
    '╹ ╹',
  ],
  N: [
    3,
    '┏┓╻',
    '┃┗┫',
    '╹ ╹',
  ],
  O: [
    3,
    '┏━┓',
    '┃ ┃',
    '┗━┛',
  ],
  P: [
    3,
    '┏━┓',
    '┣━┛',
    '╹',
  ],
  Q: [
    3,
    '┏━┓',
    '┃ ┃',
    '┗╋┛',
  ],
  R: [
    3,
    '┏━┓',
    '┣┳┛',
    '╹┗╸',
  ],
  S: [
    3,
    '┏━┓',
    '┗━┓',
    '┗━┛',
  ],
  T: [
    3,
    '╺┳╸',
    ' ┃ ',
    ' ╹ ',
  ],
  U: [
    3,
    '╻ ╻',
    '┃ ┃',
    '┗━┛',
  ],
  V: [
    4,
    '▗  ▗',
    ' ▚▗▘',
    '  ▘ ',
  ],
  W: [
    5,
    '▗   ▗',
    ' ▚▗▗▘',
    '  ▘▘ ',
  ],
  X: [
    3,
    '▗ ▗',
    ' ▚▘',
    '▗▘▚',
  ],
  Y: [
    3,
    '▗ ▗',
    ' ▚▘',
    ' ▐',
  ],
  Z: [
    3,
    '╺━┓',
    ' ▞',
    '┗━╸',
  ],
  '0': [
    3,
    '┏━┓',
    '┃▞┃',
    '┗━┛',
  ],
  '1': [
    3,
    ' ┓ ',
    ' ┃ ',
    '╺┻╸',
  ],
  '2': [
    3,
    '╺━┓',
    '┏━┛',
    '┗━╸',
  ],
  '3': [
    3,
    '╺━┓',
    ' ━┫',
    '╺━┛',
  ],
  '4': [
    3,
    '╻ ╻',
    '┗━┫',
    '  ╹',
  ],
  '5': [
    3,
    '┏━╸',
    '┗━┓',
    '╺━┛',
  ],
  '6': [
    3,
    '┏━╸',
    '┣━┓',
    '┗━┛',
  ],
  '7': [
    3,
    '╺━┓',
    '  ┃',
    '  ╹',
  ],
  '8': [
    3,
    '┏━┓',
    '┣━┫',
    '┗━┛',
  ],
  '9': [
    3,
    '┏━┓',
    '┗━┫',
    '╺━┛',
  ],
  '*': [
    2,
    '  ',
    '▚▞',
    '▞▚',
  ],
  '#': [
    3,
    '╋╋',
    '╋╋',
    '  ',
  ],
  '!': [
    1,
    '╻',
    '┃',
    '◾︎',
  ],
  ':': [
    1,
    ' ',
    '╏',
    ' ',
  ],
  '.': [
    1,
    ' ',
    ' ',
    '.',
  ],
  ',': [
    1,
    ' ',
    ' ',
    ',',
  ],
  ' ': [
    2,
    '  ',
    '  ',
    '  ',
  ],
}

// prettier-ignore
const DIGITS: Record<DigitName, Digit> = {
  A: [
    3, // width
    '╭─╮',
    '├─┤',
    '╵ ╵',
  ],
  B: [
    3,
    '┬─╮',
    '├─┤',
    '┴─╯',
  ],
  C: [
    3,
    '╭─╴',
    '│  ',
    '╰─╴',
  ],
  D: [
    3,
    '┬─╮',
    '│ │',
    '┴─╯',
  ],
  E: [
    3,
    '┌─╴',
    '├─ ',
    '└─╴',
  ],
  F: [
    3,
    '┌─╴',
    '├─ ',
    '╵  ',
  ],
  G: [
    3,
    '╭─╮',
    '│─┐',
    '╰─╯',
  ],
  H: [
    3,
    '╷ ╷',
    '├─┤',
    '╵ ╵',
  ],
  I: [
    1,
    '┬',
    '│',
    '┴',
  ],
  J: [
    2,
    ' ┬',
    ' │',
    '╰╯',
  ],
  K: [
    3,
    '╷ ╷',
    '├┬╯',
    '╵└╴',
  ],
  L: [
    3,
    '╷  ',
    '│  ',
    '╰─╴',
  ],
  M: [
    4,
    '┌┬┐',
    '│╵│',
    '╵ ╵',
  ],
  N: [
    3,
    '╷ ╷',
    '│╲│',
    '╵ ╵',
  ],
  O: [
    3,
    '╭─╮',
    '│ │',
    '╰─╯',
  ],
  P: [
    3,
    '╭─╮',
    '├─╯',
    '╵  ',
  ],
  Q: [
    3,
    '╭─╮',
    '│ │',
    '╰┼╯',
  ],
  R: [
    3,
    '╭─╮',
    '├┬╯',
    '╵└╴',
  ],
  S: [
    3,
    '╭─╮',
    '╰─╮',
    '╰─╯',
  ],
  T: [
    3,
    '╶┬╴',
    ' │ ',
    ' ╵ ',
  ],
  U: [
    3,
    '╷ ╷',
    '│ │',
    '╰─╯',
  ],
  V: [
    3,
    '   ',
    '╲ ╱',
    ' ⋁ ',
  ],
  W: [
    3,
    '╷ ╷',
    '│╷│',
    '└┴┘',
  ],
  X: [
    3,
    '∖ ╱',
    ' ╳ ',
    '╱ ∖',
  ],
  Y: [
    3,
    '╲ ╱',
    ' │',
    ' ╵',
  ],
  Z: [
    3,
    '╶─┐',
    ' ╱ ',
    '└─╴',
  ],
  '0': [
    3,
    '╭─╮',
    '│╱│',
    '╰─╯',
  ],
  '1': [
    3,
    ' ┐ ',
    ' │ ',
    '╶┴╴',
  ],
  '2': [
    3,
    '╶─╮',
    '╭─╯',
    '╰─╴',
  ],
  '3': [
    3,
    '╶─╮',
    ' ─┤',
    '╶─╯',
  ],
  '4': [
    3,
    '╷ ╷',
    '└─┤',
    '  ╵',
  ],
  '5': [
    3,
    '┌─╴',
    '└─╮',
    '╶─╯',
  ],
  '6': [
    3,
    '╭─╴',
    '├─╮',
    '╰─╯',
  ],
  '7': [
    3,
    '╶─┐',
    '  │',
    '  ╵',
  ],
  '8': [
    3,
    '┌─┐',
    '├─┤',
    '└─┘',
  ],
  '9': [
    3,
    '╭─╮',
    '╰─┤',
    '╶─╯',
  ],
  '*': [
    2,
    '  ',
    '╲╱',
    '╱╲',
  ],
  '#': [
    3,
    '┼┼',
    '┼┼',
    '  ',
  ],
  '!': [
    1,
    '╷',
    '│',
    '◾︎',
  ],
  ':': [
    1,
    ' ',
    '╏',
    ' ',
  ],
  '.': [
    1,
    ' ',
    ' ',
    '.',
  ],
  ',': [
    1,
    ' ',
    ' ',
    ',',
  ],
  ' ': [
    2,
    '  ',
    '  ',
    '  ',
  ],
}
