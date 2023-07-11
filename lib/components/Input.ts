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
    this.#chars = unicode.toPrintableChars(text)
    this.#width = unicode.lineWidth(text)
    this.#offset = 0
    this.#cursor = {start: this.#chars.length, end: this.#chars.length}
  }

  receiveKey(event: KeyEvent) {
    if (event.name === 'enter') {
      this.onSubmit?.(this.#chars.join(''))
    } else if (event.name === 'up') {
      this.#receiveKeyUp(event)
    } else if (event.name === 'down') {
      this.#receiveKeyDown(event)
    } else if (event.name === 'left') {
      this.#receiveKeyLeft(event)
    } else if (event.name === 'right') {
      this.#receiveKeyRight(event)
    } else if (event.name === 'backspace') {
      this.#receiveKeyBackspace()
    } else if (event.name === 'delete') {
      this.#receiveKeyDelete()
    } else if (isKeyPrintable(event)) {
      this.#receiveKeyPrintable(event)
    }
  }

  intrinsicSize(): Size {
    return new Size(this.#width, 1)
  }

  render(viewport: Viewport) {
    viewport.assignMouse(this, 'mouse.button.left')
    viewport.addFocus(this)
    const hasFocus = viewport.hasFocus(this)

    const line = this.#chars
    if (!line.length) {
      return
    }

    const point = new Point(0, 0).mutableCopy()
    let offset = 0,
      index = -1
    const minVisibleX = viewport.visibleRect.minX(),
      maxVisibleX = viewport.visibleRect.maxX()
    const minSelected = this.minSelected(),
      maxSelected = this.maxSelected()
    const chars = line.concat(' ')
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
      this.#width = this.#chars
        .map(unicode.charWidth)
        .reduce((a, b) => a + b, 0 as number)
    }
  }

  #receiveKeyUp({shift}: KeyEvent) {
    if (shift) {
      this.#cursor = {
        start: this.#cursor.start,
        end: 0,
      }
    } else {
      this.#cursor = {start: 0, end: 0}
    }
  }

  #receiveKeyDown({shift}: KeyEvent) {
    if (shift) {
      this.#cursor = {
        start: this.#cursor.start,
        end: this.#chars.length,
      }
    } else {
      this.#cursor = {start: this.#chars.length, end: this.#chars.length}
    }
  }

  #receiveKeyLeft({shift}: KeyEvent) {
    if (shift) {
      this.#cursor = {
        start: this.#cursor.start,
        end: Math.max(0, this.#cursor.end - 1),
      }
    } else if (isEmptySelection(this.#cursor)) {
      this.#cursor.start = this.#cursor.end = Math.max(
        0,
        this.#cursor.start - 1,
      )
    } else {
      this.#cursor.start = this.#cursor.end = this.minSelected()
    }
  }

  #receiveKeyRight({shift}: KeyEvent) {
    if (shift) {
      this.#cursor = {
        start: this.#cursor.start,
        end: Math.min(this.#chars.length, this.#cursor.end + 1),
      }
    } else if (isEmptySelection(this.#cursor)) {
      this.#cursor.start = this.#cursor.end = Math.min(
        this.#chars.length,
        this.#cursor.start + 1,
      )
    } else {
      this.#cursor.start = this.#cursor.end = this.maxSelected()
    }
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
      this.#chars = this.#chars
        .slice(0, this.minSelected())
        .concat(this.#chars.slice(this.maxSelected()))
      this.#cursor.start = this.#cursor.end = this.minSelected()
      this.#width = this.#chars
        .map(unicode.charWidth)
        .reduce((a, b) => a + b, 0 as number)
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
      this.#chars = this.#chars
        .slice(0, this.minSelected())
        .concat(this.#chars.slice(this.maxSelected()))
      this.#cursor.start = this.#cursor.end = this.minSelected()
      this.#width = this.#chars
        .map(unicode.charWidth)
        .reduce((a, b) => a + b, 0 as number)
    }
  }
}

function isEmptySelection(cursor: Cursor) {
  return cursor.start === cursor.end
}
