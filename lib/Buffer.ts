import {unicode} from './sys'

import type {Terminal, SGRTerminal} from './terminal'
import type {Color} from './ansi'
import {Style, fromSGR} from './ansi'
import {Size} from './geometry'
import {toChars} from './sys/unicode'

type Char = {char: string; width: 1 | 2; style: Style; hiding?: Char}

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
  write(str: string, style: Style) {
    if (this.x >= this.size.width || this.y < 0 || this.y >= this.size.height) {
      return
    }

    let line = this.#canvas.get(this.y)
    for (const char of toChars(str)) {
      if (char === '\n') {
        return
      }

      const width = unicode.charWidth(char)
      if (width === 0) {
        if (char === '') {
          style = Style.NONE
        } else {
          style = fromSGR(char)
        }
      } else if (this.x >= 0) {
        if (line) {
          const prev = line.get(this.x - 1)
          if (prev && prev.width === 2) {
            // hides a 2-width character that this character is overlapping
            line.set(this.x - 1, {char: ' ', width: 1, style: prev.style})

            // actually writes the character, and records the hidden character
            line.set(this.x, {char, width, style, hiding: prev})

            const hiding = prev.hiding
            if (hiding) {
              line.set(this.x - 2, hiding)
            }
          } else {
            // actually writes the character
            line.set(this.x, {char, width, style})

            const next = line.get(this.x + 1)
            if (next && next.hiding) {
              // the next character can no longer be "hiding" the previous character (this
              // character)
              line.set(this.x + 1, {...next, hiding: undefined})
            }
          }
        } else {
          line = new Map([[this.x, {char, width, style}]])
          this.#canvas.set(this.y, line)
        }
      }

      this.x += width
    }
  }

  flush(terminal: SGRTerminal) {
    let prevStyle = Style.NONE
    for (let y = 0; y < this.size.height; y++) {
      const line = this.#canvas.get(y) ?? new Map<number, Char>()
      const prevLine = this.#prev.get(y) ?? new Map<number, Char>()
      this.#prev.set(y, prevLine)

      let didWrite = false
      let dx = 1
      for (let x = 0; x < this.size.width; x += dx) {
        const chrInfo = line.get(x) ?? {char: ' ', style: Style.NONE, width: 1}
        const prevInfo = prevLine.get(x)
        if (prevInfo && isCharEqual(chrInfo, prevInfo)) {
          didWrite = false
          continue
        }

        if (!didWrite) {
          didWrite = true
          terminal.move(x, y)
        }

        const {char, width, style} = chrInfo

        if (prevStyle !== style) {
          terminal.write(style.toSGR() + char)
          prevStyle = style
        } else {
          terminal.write(char)
        }
        prevLine.set(x, chrInfo)

        dx = width
      }
    }
  }
}

function isCharEqual(lhs: Char, rhs: Char) {
  return (
    lhs.char === rhs.char &&
    lhs.width === rhs.width &&
    lhs.style.isEqual(rhs.style)
  )
}
