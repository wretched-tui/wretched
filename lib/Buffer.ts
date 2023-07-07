import {unicode} from './sys'

import type {Terminal, Color} from './types'
import {RESET} from './ansi'
import {Size} from './geometry'
import {toChars} from './sys/unicode'

const NUL = {char: '', width: 1, attrs: ''} as const
type Char = {char: string; width: 1 | 2; attrs: string; hiding?: Char}

export class Buffer implements Terminal {
  size: Size = Size.zero
  x: number = 0
  y: number = 0
  get cols() {
    return this.size.width
  }
  get rows() {
    return this.size.height
  }
  #canvas: Map<number, Map<number, Char>> = new Map()
  #prev: Map<number, Map<number, Char>> = new Map()

  setForeground(fg: Color): void {}
  setBackground(bg: Color): void {}

  resize(size: Size) {
    if (size.width < this.size.width || size.height < this.size.height) {
      this.#canvas = new Map()
      this.#prev = new Map()
    }

    this.size = size
  }

  move(x: number, y: number) {
    this.x = x
    this.y = y
  }

  /**
   * Writes the string at the cursor from left to write. Exits on newline (no default
   * wrapping behavior).
   */
  write(str: string) {
    if (this.x >= this.size.width || this.y < 0 || this.y >= this.size.height) {
      return
    }

    let attrs = ''
    let line = this.#canvas.get(this.y)
    for (const char of toChars(str)) {
      if (char === '\n') {
        return
      }

      const width = unicode.charWidth(char)
      if (width === 0) {
        if (char === '') {
          attrs = RESET
        } else {
          attrs = char
        }
      } else if (this.x >= 0) {
        if (line) {
          const prev = line.get(this.x - 1)
          if (prev && prev.width === 2) {
            // hides a 2-width character that this character is overlapping
            line.set(this.x - 1, {char: ' ', width: 1, attrs: prev.attrs})

            // actually writes the character, and records the hidden character
            line.set(this.x, {char, width, attrs, hiding: prev})

            const hiding = prev.hiding
            if (hiding) {
              line.set(this.x - 2, hiding)
            }
          } else {
            // actually writes the character
            line.set(this.x, {char, width, attrs})

            const next = line.get(this.x + 1)
            if (next && next.hiding) {
              // the next character can no longer be "hiding" the previous character (this
              // character)
              line.set(this.x + 1, {...next, hiding: undefined})
            }
          }
        } else {
          line = new Map([[this.x, {char, width, attrs}]])
          this.#canvas.set(this.y, line)
        }
      }

      this.x += width
    }
  }

  flush(terminal: Terminal) {
    let prevAttrs = ''
    for (let y = 0; y < this.size.height; y++) {
      const line = this.#canvas.get(y) ?? new Map<number, Char>()
      const prevLine = this.#prev.get(y) ?? new Map<number, Char>()

      let didWrite = false
      let dx = 1
      for (let x = 0; x < this.size.width; x += dx) {
        const chrInfo = line.get(x) ?? {char: ' ', attrs: RESET, width: 1}
        const prevChar = prevLine.get(x)
        if (prevChar && isCharEqual(chrInfo, prevChar)) {
          didWrite = false
          continue
        }

        const {char, width, attrs} = chrInfo

        if (prevAttrs !== attrs) {
          if (!didWrite) {
            didWrite = true
            terminal.move(x, y)
          }
          terminal.write(attrs + char)
          prevAttrs = attrs
        } else {
          if (!didWrite) {
            didWrite = true
            terminal.move(x, y)
          }
          terminal.write(char)
        }

        dx = width
      }
    }
  }
}

function isCharEqual(lhs: Char, rhs: Char) {
  return (
    lhs.char === rhs.char && lhs.width === rhs.width && lhs.attrs === rhs.attrs
  )
}
