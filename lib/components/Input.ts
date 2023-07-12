import {unicode} from '../sys'

import type {KeyEvent} from '../events'
import {isKeyPrintable} from '../events'
import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Style} from '../ansi'
import {Point, Size} from '../geometry'

interface Props {
  text: string
}

interface Cursor {
  start: number
  end: number
}

/**
 * Single line text input
 */
export class Input extends View {
  /**
   * Array of graphemes
   */
  #chars: string[]
  onChange?: (text: string) => void
  onSubmit?: (text: string) => void

  // Printable width
  #width: number
  #visibleWidth: number = 0
  // Text drawing starts at this offset (if it can't fit on screen)
  #offset: number
  #cursor: Cursor

  minSelected() {
    return Math.min(this.#cursor.start, this.#cursor.end)
  }

  maxSelected() {
    return isEmptySelection(this.#cursor)
      ? this.#cursor.start + 1
      : Math.max(this.#cursor.start, this.#cursor.end)
  }

  constructor({text}: Props) {
    super()
    text = unicode.removeAnsi(text)
    this.#chars = unicode.printableChars(text)
    this.#width = unicode.lineWidth(text)
    this.#offset = 0
    this.#cursor = {start: this.#chars.length, end: this.#chars.length}
  }

  receiveKey(event: KeyEvent) {
    const prevChars = this.#chars
    this.#showCursor = true
    this.#dt = 0

    if (event.name === 'enter' || event.name === 'return') {
      this.onSubmit?.(this.#chars.join(''))
      return
    }

    if (event.name === 'up' || event.name === 'home') {
      this.#receiveKeyUp(event)
    } else if (event.name === 'down' || event.name === 'end') {
      this.#receiveKeyDown(event)
    } else if (event.name === 'left') {
      this.#receiveKeyLeft(event)
    } else if (event.name === 'right') {
      this.#receiveKeyRight(event)
    } else if (event.name === 'backspace') {
      this.#receiveKeyBackspace()
    } else if (event.name === 'delete') {
      this.#receiveKeyDelete()
    } else if (event.full === 'C-w') {
      this.#receiveKeyDeleteWord()
    } else if (isKeyPrintable(event)) {
      this.#receiveKeyPrintable(event)
    }

    if (prevChars !== this.#chars) {
      this.onChange?.(this.#chars.join(''))
    }
  }

  intrinsicSize(): Size {
    return new Size(this.#width, 1)
  }

  render(viewport: Viewport) {
    viewport.registerMouse(this, 'mouse.button.left')
    viewport.registerFocus(this)
    const hasFocus = viewport.hasFocus(this)
    this.#visibleWidth = viewport.contentSize.width
    if (this.#cursor.end < this.#offset) {
      this.#offset = this.#cursor.end
    } else if (this.#cursor.end >= this.#offset + this.#visibleWidth) {
      this.#offset = this.#cursor.end - this.#visibleWidth - 1
    }

    const point = new Point(0, 0).mutableCopy()
    let offset = 0,
      index = -1
    const minVisibleX = viewport.visibleRect.minX(),
      maxVisibleX = viewport.visibleRect.maxX()
    const minSelected = this.minSelected(),
      maxSelected = this.maxSelected()
    const chars = this.#chars.concat(' ')
    viewport.usingPen(() => {
      for (const char of chars) {
        const width = unicode.charWidth(char)
        if (width === 0) {
          continue
        }

        index += 1

        offset += 1
        if (offset < this.#offset) {
          break
        }

        if (point.x >= minVisibleX && point.x + width - 1 < maxVisibleX) {
          if (hasFocus) {
            let style: Style
            if (index === minSelected) {
              if (isEmptySelection(this.#cursor)) {
                style = new Style({underline: true})
              } else {
                style = new Style({inverse: true})
              }
              viewport.replacePen(style)
            } else if (index === maxSelected) {
              style = Style.NONE
              viewport.replacePen(style)
            }
          }

          viewport.write(char, point)
        }

        point.x += width
        if (point.x >= maxVisibleX) {
          break
        }
      }
    })
  }

  #receiveKeyPrintable({char}: KeyEvent) {
    if (isEmptySelection(this.#cursor)) {
      this.#chars = this.#chars
        .slice(0, this.#cursor.start)
        .concat(char, this.#chars.slice(this.#cursor.start))
      this.#cursor.start = this.#cursor.end = this.#cursor.start + 1
      this.#width += unicode.charWidth(char)
    } else {
      this.#chars = this.#chars
        .slice(0, this.minSelected())
        .concat(char, this.#chars.slice(this.maxSelected()))
      this.#cursor.start = this.#cursor.end = this.minSelected() + 1
      this.#updateWidth()
    }
  }

  #receiveKeyUp({shift}: KeyEvent) {
    if (shift) {
      this.#cursor.end = 0
    } else {
      this.#cursor = {start: 0, end: 0}
    }
  }

  #receiveKeyDown({shift}: KeyEvent) {
    if (shift) {
      this.#cursor.end = this.#chars.length
    } else {
      this.#cursor = {start: this.#chars.length, end: this.#chars.length}
    }
  }

  #prevWordOffset(shift: boolean): number {
    let cursor: number
    if (shift) {
      cursor = this.#cursor.end
    } else if (isEmptySelection(this.#cursor)) {
      cursor = this.#cursor.start
    } else {
      cursor = this.minSelected()
    }

    let prevWordOffset: number = 0
    for (const [chars, offset] of unicode.words(this.#chars)) {
      prevWordOffset = offset
      if (cursor <= offset + chars.length) {
        break
      }
    }

    return prevWordOffset
  }

  #nextWordOffset(shift: boolean): number {
    let cursor: number
    if (shift) {
      cursor = this.#cursor.end
    } else if (isEmptySelection(this.#cursor)) {
      cursor = this.#cursor.start
    } else {
      cursor = this.maxSelected()
    }

    let nextWordOffset: number = 0
    for (const [chars, offset] of unicode.words(this.#chars)) {
      nextWordOffset = offset + chars.length
      if (cursor < offset + chars.length) {
        break
      }
    }

    return nextWordOffset
  }

  #receiveKeyLeft({shift, meta}: KeyEvent) {
    if (meta) {
      const prevWordOffset = this.#prevWordOffset(shift)
      if (shift) {
        this.#cursor.end = prevWordOffset
      } else {
        this.#cursor.start = this.#cursor.end = prevWordOffset
      }
    } else if (shift) {
      this.#cursor.end = Math.max(0, this.#cursor.end - 1)
    } else if (isEmptySelection(this.#cursor)) {
      this.#cursor.start = this.#cursor.end = Math.max(
        0,
        this.#cursor.start - 1,
      )
    } else {
      this.#cursor.start = this.#cursor.end = this.minSelected()
    }
  }

  #receiveKeyRight({shift, meta}: KeyEvent) {
    if (meta) {
      const nextWordOffset = this.#nextWordOffset(shift)
      if (shift) {
        this.#cursor.end = nextWordOffset
      } else {
        this.#cursor.start = this.#cursor.end = nextWordOffset
      }
    } else if (shift) {
      this.#cursor.end = Math.min(this.#chars.length, this.#cursor.end + 1)
    } else if (isEmptySelection(this.#cursor)) {
      this.#cursor.start = this.#cursor.end = Math.min(
        this.#chars.length,
        this.#cursor.start + 1,
      )
    } else {
      this.#cursor.start = this.#cursor.end = this.maxSelected()
    }
  }

  #updateWidth() {
    this.#width = this.#chars
      .map(unicode.charWidth)
      .reduce((a, b) => a + b, 0 as number)
  }

  #deleteSelection() {
    this.#chars = this.#chars
      .slice(0, this.minSelected())
      .concat(this.#chars.slice(this.maxSelected()))
    this.#cursor.start = this.#cursor.end = this.minSelected()
    this.#updateWidth()
  }

  #receiveKeyBackspace() {
    if (isEmptySelection(this.#cursor)) {
      if (this.#cursor.start === 0) {
        return
      }
      this.#width -= unicode.charWidth(this.#chars[this.#cursor.start - 1])
      this.#chars = this.#chars
        .slice(0, this.#cursor.start - 1)
        .concat(this.#chars.slice(this.#cursor.start))
      this.#cursor.start = this.#cursor.end = this.#cursor.start - 1
    } else {
      this.#deleteSelection()
    }
  }

  #receiveKeyDelete() {
    if (isEmptySelection(this.#cursor)) {
      if (this.#cursor.start >= this.#chars.length - 1) {
        return
      }
      this.#width -= unicode.charWidth(this.#chars[this.#cursor.start + 1])
      this.#chars = this.#chars
        .slice(0, this.#cursor.start)
        .concat(this.#chars.slice(this.#cursor.start + 1))
    } else {
      this.#deleteSelection()
    }
  }

  #receiveKeyDeleteWord() {
    if (!isEmptySelection(this.#cursor)) {
      return this.#deleteSelection()
    }

    if (this.#cursor.start === 0) {
      return
    }

    const offset = this.#prevWordOffset(false)
    this.#chars = this.#chars
      .slice(0, offset)
      .concat(this.#chars.slice(this.#cursor.start))
    this.#cursor.start = this.#cursor.end = offset
    this.#updateWidth()
  }
}

function isEmptySelection(cursor: Cursor) {
  return cursor.start === cursor.end
}
