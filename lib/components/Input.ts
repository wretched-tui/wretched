import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Style} from '../ansi'
import {Point, Size} from '../geometry'
import type {KeyEvent} from '../events'

interface Props {
  text: string
}

/**
 * Single line text input
 */
export class Input extends View {
  text: string
  /**
   * text drawing starts at this offset
   */
  #offset: number
  #cursor: number

  constructor({text}: Props) {
    super()
    this.text = text
    this.#offset = 0
    this.#cursor = [...text].length
  }

  receiveKey(event: KeyEvent) {
    if (isPrintable(event)) {
      this.text += event.sequence
    }
  }

  intrinsicSize(): Size {
    const width = unicode.lineWidth(this.text)
    return new Size(width, 1)
  }

  render(viewport: Viewport) {
    viewport.assignMouse(this, 'mouse.button.left')
    viewport.addFocus(this)
    const hasFocus = viewport.hasFocus(this)

    const line = this.text
    if (!line.length) {
      return
    }

    const point = new Point(0, 0).mutableCopy()
    let offset = 0,
      index = -1
    const minX = viewport.visibleRect.minX(),
      maxX = viewport.visibleRect.maxX()
    const chars = unicode.toChars(line).concat(' ')
    for (let char of chars) {
      index += 1

      if (char === '\n') {
        char = ' '
      }

      const width = unicode.charWidth(char)
      if (width === 0) {
        continue
      }

      offset += width
      if (offset < this.#offset) {
        break
      }

      if (point.x >= minX && point.x + width - 1 < maxX) {
        let style: Style
        if (this.#cursor === index) {
          if (hasFocus) {
            style = new Style({inverse: true})
          } else {
            style = new Style({underline: true})
          }
        } else {
          style = Style.NONE
        }

        viewport.usingPen(style, () => {
          viewport.write(char, point)
        })
      }

      point.x += width
      if (point.x >= maxX) {
        break
      }
    }
  }
}

function isPrintable(event: KeyEvent) {
  return true
}
