import {unicode} from '../sys'

import type {KeyEvent, MouseEvent} from '../events'
import {isKeyPrintable} from '../events'
import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Style} from '../Style'
import {Point, Size} from '../geometry'
import {System} from '../System'

interface Props extends ViewProps {
  text?: string
  placeholder?: string
  onChange?: (text: string) => void
  onSubmit?: (text: string) => void
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
  #chars: string[] = []
  #onChange?: (text: string) => void
  #onSubmit?: (text: string) => void

  // Printable width
  #width: number = 0
  // Text drawing starts at this offset (if it can't fit on screen)
  #offset: number = 0
  #cursor: Cursor = {start: 0, end: 0}

  constructor(props: Props = {}) {
    super(props)
    this.#update(props)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({text, onChange, onSubmit}: Props) {
    this.#onChange = onChange
    this.#onSubmit = onSubmit
    text = unicode.removeAnsi(text ?? '')

    this.#chars = unicode.printableChars(text)
    this.#width = unicode.lineWidth(text)
    this.#offset = 0
    this.#cursor = {start: this.#chars.length, end: this.#chars.length}
  }

  naturalSize(): Size {
    return new Size(this.#width + 1, 1)
  }

  minSelected() {
    return Math.min(this.#cursor.start, this.#cursor.end)
  }

  maxSelected() {
    return isEmptySelection(this.#cursor)
      ? this.#cursor.start + 1
      : Math.max(this.#cursor.start, this.#cursor.end)
  }

  get text() {
    return this.#chars.join('')
  }
  set text(text: string) {
    text = unicode.removeAnsi(text)
    this.#chars = unicode.printableChars(text)
    this.#width = unicode.lineWidth(text)
    if (this.#cursor.start > this.#chars.length) {
      this.#cursor.start = this.#chars.length
    }
    if (this.#cursor.end > this.#chars.length) {
      this.#cursor.end = this.#chars.length
    }
    this.invalidateSize()
  }

  #showCursor = true
  #dt = 0
  receiveTick(dt: number): boolean {
    this.#dt += dt
    if (this.#dt > 500) {
      this.#showCursor = !this.#showCursor
      this.#dt = this.#dt % 500
      return true
    }

    return false
  }

  receiveKey(event: KeyEvent) {
    const prevChars = this.#chars
    this.#showCursor = true
    this.#dt = 0

    if (event.name === 'enter' || event.name === 'return') {
      this.#onSubmit?.(this.#chars.join(''))
      return
    }

    if (event.name === 'up' || event.name === 'home' || event.full === 'C-a') {
      this.#receiveKeyUpArrow(event)
    } else if (
      event.name === 'down' ||
      event.name === 'end' ||
      event.full === 'C-e'
    ) {
      this.#receiveKeyDownArrow(event)
    } else if (event.name === 'left') {
      this.#receiveKeyLeftArrow(event)
    } else if (event.name === 'right') {
      this.#receiveKeyRightArrow(event)
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
      this.#onChange?.(this.#chars.join(''))
    }
  }

  toPosition(offset: number) {
    let p = 0
    for (let index = 0; index < offset; index++) {
      p += unicode.charWidth(this.#chars[index])
    }
    return p
  }

  toOffset(position: number) {
    let p = 0
    for (let index = 0; index < this.#chars.length; index++) {
      if (p >= position) {
        return index
      }
      p += unicode.charWidth(this.#chars[index])
    }
    return this.#chars.length - 1
  }

  receiveMouse(event: MouseEvent, system: System) {
    if (event.name === 'mouse.button.down') {
      system.requestFocus()
    }
  }

  render(viewport: Viewport) {
    const hasFocus = viewport.registerFocus()
    if (hasFocus) {
      viewport.registerTick()
    } else if (this.#dt !== 0) {
      this.#showCursor = true
      this.#dt = 0
    }

    const visibleWidth = viewport.contentSize.width
    const quarterWidth = Math.round(visibleWidth / 4)
    if (visibleWidth > this.#width) {
      this.#offset = 0
    } else if (
      this.toPosition(this.#cursor.end) - quarterWidth <=
      this.toPosition(this.#offset)
    ) {
      this.#offset = this.toOffset(
        Math.max(0, this.toPosition(this.#cursor.end) - quarterWidth),
      )
    } else if (
      this.toPosition(this.#cursor.end) + quarterWidth >=
      this.toPosition(this.#offset) + visibleWidth
    ) {
      this.#offset = this.toOffset(
        Math.min(
          this.toPosition(this.#chars.length) - visibleWidth + 1,
          this.toPosition(this.#cursor.end) - visibleWidth + quarterWidth + 1,
        ),
      )
    }

    const point = new Point(0, 0).mutableCopy()
    let index = -1
    const minVisibleX = viewport.visibleRect.minX(),
      maxVisibleX = viewport.visibleRect.maxX()
    const minSelected = this.minSelected(),
      maxSelected = this.maxSelected()
    const chars = this.#chars.concat(' ')
    let currentStyle = Style.NONE
    viewport.usingPen(pen => {
      viewport.registerMouse('mouse.button.left')

      for (const char of chars) {
        const width = unicode.charWidth(char)
        if (width === 0) {
          continue
        }

        index += 1

        if (index < this.#offset) {
          continue
        }

        if (point.x >= minVisibleX && point.x + width - 1 < maxVisibleX) {
          if (hasFocus) {
            let style: Style
            if (index >= minSelected && index < maxSelected) {
              if (isEmptySelection(this.#cursor)) {
                if (this.#showCursor) {
                  style = new Style({underline: true})
                } else {
                  style = Style.NONE
                }
              } else {
                if (index === this.#cursor.end && !this.#showCursor) {
                  style = new Style({inverse: true, underline: true})
                } else {
                  style = new Style({inverse: true})
                }
              }
            } else {
              style = Style.NONE
            }

            if (!currentStyle.isEqual(style)) {
              pen.replacePen(style)
              currentStyle = style
            }
          }

          if (this.#offset > 0 && point.x === minVisibleX) {
            viewport.write('…', point)
          } else if (
            this.#offset + visibleWidth < this.#chars.length &&
            point.x === maxVisibleX - 1
          ) {
            viewport.write('…', point)
          } else {
            viewport.write(char, point)
          }
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

  #receiveKeyUpArrow({shift}: KeyEvent) {
    if (shift) {
      this.#cursor.end = 0
    } else {
      this.#cursor = {start: 0, end: 0}
    }
  }

  #receiveKeyDownArrow({shift}: KeyEvent) {
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

  #receiveKeyLeftArrow({shift, meta}: KeyEvent) {
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

  #receiveKeyRightArrow({shift, meta}: KeyEvent) {
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
      if (this.#cursor.start > this.#chars.length - 1) {
        return
      }
      this.#width -= unicode.charWidth(this.#chars[this.#cursor.start])
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
