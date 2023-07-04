import {unicode} from './sys'

import type {Terminal} from './types'
import {RESET} from './ansi'
import {point, size, Rect, Point, Size} from './geometry'
import {toChars} from './sys/unicode'

/**
 * Defines a region (size) in which to draw, and a subset (visibleRect) that is
 * on-screen. Anything not in the rect is considered invisible (and any drawing
 * outside the rect will be clipped)
 */
export class Viewport {
  readonly contentSize: Size
  readonly visibleRect: Rect
  readonly offset: Point
  readonly terminal: Terminal

  constructor(
    terminal: Terminal,
    contentSize: Size,
    visibleRect: Rect,
    offset?: Point,
  ) {
    this.terminal = terminal
    this.contentSize = contentSize
    this.visibleRect = visibleRect
    this.offset = offset ?? Point.zero
    Object.defineProperty(this, 'terminal', {
      enumerable: false,
    })
  }

  /**
   * Does not support newlines (no default wrapping behavior),
   * always prints left-to-right.
   */
  write(input: string, to: Point) {
    if (
      to.x >= this.visibleRect.maxX() ||
      to.y < this.visibleRect.minY() ||
      to.y >= this.visibleRect.maxY()
    ) {
      return
    }

    let x = to.x
    let visibleX = 0
    let visible: string | undefined = undefined
    let attrs = ''
    let suffix = ''
    for (const char of toChars(input)) {
      if (char === '\n') {
        break
      }

      const width = unicode.charWidth(char)
      if (width === 0) {
        attrs = char
        if (visible !== undefined) {
          visible += char
        }
      } else if (x >= this.visibleRect.minX() && x + width - 1 < this.visibleRect.maxX()) {
        if (visible === undefined) {
          visible = attrs
          visibleX = x
          if (attrs) {
            suffix = RESET
          }
        }
        visible += char
      }

      x += width

      // no need to consider characters after this; newline/wrap isn't supported here
      if (x >= this.visibleRect.maxX()) {
        break
      }
    }

    this.terminal.move(this.offset.x + visibleX, this.offset.y + to.y)
    if (visible !== undefined) {
      this.terminal.write(visible + suffix)
    }
  }

  clipped(clip: Rect): Viewport {
    const offsetX = this.offset.x + clip.origin.x
    const offsetY = this.offset.y + clip.origin.y
    const contentWidth = Math.max(0, clip.size.width)
    const contentHeight = Math.max(0, clip.size.height)

    const visibleMinX = Math.max(0, this.visibleRect.origin.x - clip.origin.x)
    const visibleMinY = Math.max(0, this.visibleRect.origin.y - clip.origin.y)
    const visibleMaxX = Math.min(
      clip.size.width,
      this.visibleRect.origin.x + this.visibleRect.size.width - clip.origin.x,
    )
    const visibleMaxY = Math.min(
      clip.size.height,
      this.visibleRect.origin.y + this.visibleRect.size.height - clip.origin.y,
    )

    const contentSize = new Size(contentWidth, contentHeight)
    const visibleRect = new Rect(
      point(visibleMinX, visibleMinY),
      size(visibleMaxX - visibleMinX, visibleMaxY - visibleMinY),
    )
    const offset = point(offsetX, offsetY)
    return new Viewport(this.terminal, contentSize, visibleRect, offset)
  }
}
