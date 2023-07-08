import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Style, fromSGR, colorToSGR} from '../ansi'
import {Point, Size} from '../geometry'

type Alignment = 'left' | 'right' | 'center'

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
    this.#cursor = 0
  }

  intrinsicSize(availableSize: Size): Size {
    const width = unicode.lineWidth(this.text)
    return new Size(width, 1)
  }

  render(viewport: Viewport) {
    const line = this.text
    if (!line.length) {
      return
    }

    const point = new Point(0, 0).mutableCopy()
    let offset = 0,
      index = -1
    const minX = viewport.visibleRect.minX(),
      maxX = viewport.visibleRect.maxX()
    for (let char of unicode.toChars(line)) {
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
        if (index === this.#cursor) {
          viewport.pushPen(new Style({inverse: true}))
          viewport.write(char, point)
          viewport.popPen()
        } else {
          viewport.write(char, point)
        }
      }

      point.x += width
      if (point.x >= maxX) {
        break
      }
    }
  }
}
