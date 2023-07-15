import {unicode} from './sys'

import type {Terminal, SGRTerminal} from './terminal'
import type {Color} from './Color'
import {Style} from './Style'
import {Size} from './geometry'

type Char = {char: string; width: 1 | 2; style: Style; hiding?: Char}

export class Buffer implements Terminal {
  size: Size = Size.zero
  get cols() {
    return this.size.width
  }
  get rows() {
    return this.size.height
  }
  #meta: string = ''
  #canvas: Map<number, Map<number, Char>> = new Map()
  #prev: Map<number, Map<number, Char>> = new Map()

  setForeground(fg: Color): void {}
  setBackground(bg: Color): void {}

  resize(size: Size) {
    if (size.width !== this.size.width || size.height !== this.size.height) {
      this.#prev = new Map()
    }

    this.size = size
  }

  /**
   * Writes the string at the cursor from left to write. Exits on newline (no default
   * wrapping behavior).
   */
  writeChar(char: string, x: number, y: number, style: Style) {
    x = ~~x
    y = ~~y
    if (char === '\n') {
      return
    }
    const width = unicode.charWidth(char)
    if (width === 0) {
      return
    }

    if (x >= this.size.width || y < 0 || y >= this.size.height) {
      return
    }

    let line = this.#canvas.get(y)
    const prevStyle = line?.get(x)?.style
    style = prevStyle ? style.defaultBackground(prevStyle) : style
    if (x >= 0) {
      if (line) {
        const prev = line.get(x - 1)
        if (prev && prev.width === 2) {
          // hides a 2-width character that this character is overlapping
          line.set(x - 1, {char: ' ', width: 1, style: prev.style})

          // actually writes the character, and records the hidden character
          line.set(x, {char, width, style, hiding: prev})

          const hiding = prev.hiding
          if (hiding) {
            line.set(x - 2, hiding)
          }
        } else {
          // actually writes the character
          line.set(x, {char, width, style})

          const next = line.get(x + 1)
          if (next && next.hiding) {
            // the next character can no longer be "hiding" the previous character (this
            // character)
            line.set(x + 1, {...next, hiding: undefined})
          }
        }
      } else {
        line = new Map([[x, {char, width, style}]])
        this.#canvas.set(y, line)
      }
    }
  }

  /**
   * For ANSI sequences that aren't related to any specific character.
   */
  writeMeta(str: string) {
    this.#meta += str
  }

  flush(terminal: SGRTerminal) {
    if (this.#meta) {
      terminal.write(this.#meta)
    }

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
          terminal.write(style.toSGR(prevStyle) + char)
          prevStyle = style
        } else {
          terminal.write(char)
        }
        prevLine.set(x, chrInfo)

        dx = width
      }
    }

    if (prevStyle !== Style.NONE) {
      terminal.write('\x1b[0m')
    }

    this.#canvas = new Map()
  }
}

function isCharEqual(lhs: Char, rhs: Char) {
  return (
    lhs.char === rhs.char &&
    lhs.width === rhs.width &&
    lhs.style.isEqual(rhs.style)
  )
}
