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

  setForeground(fg: Color): void {}
  setBackground(bg: Color): void {}

  clear(size: Size) {
    if (size.width < this.size.width) {
      for (let y = 0; y < size.height; y++) {
        for (let x = size.width; x < this.size.width; x++) {
          this.#canvas.get(y)?.delete(x)
        }
      }
    }

    if (size.height < this.size.height) {
      for (let y = size.height; y < this.size.height; y++) {
        this.#canvas.delete(y)
      }
    }

    this.#canvas = new Map()
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
        if (char === RESET) {
          attrs = ''
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
      let line = this.#canvas.get(y) ?? new Map<number, Char>()

      terminal.move(0, y)
      let dx = 1
      for (let x = 0; x < this.size.width; x += dx) {
        const chrInfo = line.get(x) ?? {char: ' ', attrs: '', width: 1}
        const {char, width, attrs} = chrInfo

        if (prevAttrs !== attrs) {
          if (attrs === '') {
            terminal.write(RESET + char)
          } else {
            terminal.write(attrs + char)
          }
          prevAttrs = attrs
        } else {
          terminal.write(char)
        }

        dx = width
      }

      terminal.write(RESET)
      prevAttrs = ''
    }
  }
}
