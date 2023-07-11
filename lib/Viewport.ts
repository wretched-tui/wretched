import {unicode} from './sys'

import type {Terminal} from './terminal'
import {Style, RESET, fromSGR} from './ansi'
import {Rect, Point, Size} from './geometry'
import {Screen} from './Screen'
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
  #screen: Screen
  #pen: Style[] = []
  get pen() {
    return this.#pen[0]
  }

  constructor(
    screen: Screen,
    terminal: Terminal | Viewport,
    contentSize: Size,
    visibleRect: Rect,
    offset?: Point,
  ) {
    this.#screen = screen
    if (terminal instanceof Viewport) {
      this.terminal = terminal.terminal
    } else {
      this.terminal = terminal
    }

    this.contentSize = contentSize
    this.visibleRect = visibleRect
    this.offset = offset ?? Point.zero
    Object.defineProperty(this, 'terminal', {
      enumerable: false,
    })
  }

  usingPen(style: Style | undefined, draw: () => void): void
  usingPen(draw: () => void): void
  usingPen(...args: [Style | undefined, () => void] | [() => void]): void {
    if (args.length === 2) {
      if (args[0] && args[0] !== Style.NONE) {
        this.#pushPen(args[0])
      }
      args[1]()
      if (args[0]) {
        this.#popPen()
      }
    } else {
      args[0]()
    }
  }

  replacePen(style: Style): this {
    this.#pen[0] = style
    return this
  }

  #pushPen(style: Style | undefined = undefined): this {
    style ??= this.#pen[0] ?? Style.NONE
    // yeah I know I said pushPen but #pen[0] is easier!
    this.#pen.unshift(style)
    return this
  }

  #popPen(): this {
    this.#pen.shift()
    return this
  }

  hasFocus(view: View) {
    return this.#screen.hasFocus(view)
  }

  addFocus(view: View) {
    return this.#screen.addFocus(view)
  }

  // nextFocus() {
  //   this.#screen.nextFocus()
  // }

  assignMouse(view: View, ...eventNames: MouseEventListenerName[]) {
    const maxX = this.visibleRect.maxX()
    const maxY = this.visibleRect.maxY()
    for (let y = this.visibleRect.minY(); y < maxY; ++y)
      for (let x = this.visibleRect.minX(); x < maxX; ++x) {
        this.#screen.assignMouse(view, this.offset, new Point(x, y), eventNames)
      }
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
    const pen = this.#pen[0] ?? Style.NONE
    let style = pen
    for (const char of unicode.toPrintableChars(input)) {
      if (char === '\n') {
        break
      }

      const width = unicode.charWidth(char)
      if (width === 0) {
        style = char === RESET ? pen : fromSGR(char).merge(pen)
      } else if (
        x >= this.visibleRect.minX() &&
        x + width - 1 < this.visibleRect.maxX()
      ) {
        this.terminal.writeChar(
          char,
          this.offset.x + x,
          this.offset.y + to.y,
          style,
        )
      }

      x += width

      // no need to consider characters after this; newline/wrap isn't supported here
      if (x >= this.visibleRect.maxX()) {
        break
      }
    }
  }

  /**
   * Forwards 'meta' ANSI sequences (see ITerm) to the terminal
   */
  writeMeta(str: string) {
    this.terminal.writeMeta(str)
  }

  clipped(clip: Rect, draw: (viewport: Viewport) => void) {
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

    // do not copy `#pen` - child views assume this is reset
    draw(new Viewport(this.#screen, this, contentSize, visibleRect, offset))
  }
}
