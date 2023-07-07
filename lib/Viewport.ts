import {unicode} from './sys'

import type {Terminal} from './types'
import {RESET, style} from './ansi'
import {Rect, Point, Size} from './geometry'
import {View} from './View'
import type {MouseEventListenerName, MouseEventListener} from './events'

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
  #mouseListeners: Map<string, MouseEventListener>
  #pen = RESET

  constructor(
    terminal: Terminal | Viewport,
    contentSize: Size,
    visibleRect: Rect,
    offset?: Point,
  ) {
    if (terminal instanceof Viewport) {
      this.terminal = terminal.terminal
      this.#mouseListeners = terminal.#mouseListeners
    } else {
      this.terminal = terminal
      this.#mouseListeners = new Map()
    }

    this.contentSize = contentSize
    this.visibleRect = visibleRect
    this.offset = offset ?? Point.zero
    Object.defineProperty(this, 'terminal', {
      enumerable: false,
    })
  }

  setPen(attrs: string): this {
    this.#pen = style(attrs)
    return this
  }

  assignMouse(view: View, ...eventNames: MouseEventListenerName[]) {
    const maxX = this.visibleRect.maxX()
    const maxY = this.visibleRect.maxY()
    for (let y = this.visibleRect.minY(); y < maxY; ++y)
      for (let x = this.visibleRect.minX(); x < maxX; ++x)
        for (const eventName of eventNames) {
          const key = mouseKey(this.offset.x + x, this.offset.y + y, eventName)
          const target = {
            view,
            offset: this.offset,
          } as const
          const listener = this.#mouseListeners.get(key) ?? {move: []}
          if (eventName === 'mouse.move') {
            listener.move.unshift(target)
            this.#mouseListeners.set(key, listener)
          } else if (
            eventName.startsWith('mouse.button.') &&
            !listener.button
          ) {
            listener.button = target
            this.#mouseListeners.set(key, listener)
          } else if (eventName === 'mouse.wheel' && !listener.wheel) {
            listener.wheel = target
            this.#mouseListeners.set(key, listener)
          }
        }
  }

  getMouseListener(x: number, y: number, event: MouseEventListenerName) {
    return this.#mouseListeners.get(mouseKey(x, y, event))
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
    let attrs = this.#pen
    for (const char of unicode.toChars(input)) {
      if (char === '\n') {
        break
      }

      const width = unicode.charWidth(char)
      if (width === 0) {
        attrs = char === RESET ? this.#pen : char
        if (visible !== undefined) {
          visible += char
        }
      } else if (
        x >= this.visibleRect.minX() &&
        x + width - 1 < this.visibleRect.maxX()
      ) {
        if (visible === undefined) {
          visible = attrs
          visibleX = x
        }
        visible += char
      }

      x += width

      // no need to consider characters after this; newline/wrap isn't supported here
      if (x >= this.visibleRect.maxX()) {
        break
      }
    }

    if (visible !== undefined) {
      this.terminal.move(this.offset.x + visibleX, this.offset.y + to.y)
      this.terminal.write(visible + RESET)
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
      new Point(visibleMinX, visibleMinY),
      new Size(visibleMaxX - visibleMinX, visibleMaxY - visibleMinY),
    )
    const offset = new Point(offsetX, offsetY)
    return new Viewport(this, contentSize, visibleRect, offset)
  }
}

function mouseKey(x: number, y: number, event: string) {
  return `${x},${y}:${event}`
}
