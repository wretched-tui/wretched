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
  | 'x'
  | '#'
  | ':'
  | '!'
  | '.'
  | ','
type Digit = [1 | 2 | 3, string, string, string]

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
      c = c.toUpperCase()
      const digits = this.#bold ? DIGITS_BOLD : DIGITS
      if (digits[c as DigitName]) {
        filtered += c
        return [digits[c as DigitName]]
      } else {
        return []
      }
    })
    this.#text = filtered
  }

  naturalSize(availableSize: Size): Size {
    const width = this.#digits.reduce((total, [w]) => total + w, 0)
    return new Size(width, 3)
  }

  render(viewport: Viewport) {
    viewport.usingPen(this.#style, pen => {
      const point = new Point(0, 0).mutableCopy()
      for (const [width, ...lines] of this.#digits) {
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
  'x': [
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
  'x': [
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
}
