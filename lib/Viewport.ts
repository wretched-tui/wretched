import {unicode} from './sys'

import type {Terminal} from './terminal'
import {RESET} from './ansi'
import {Style} from './Style'
import {Rect, Point, Size} from './geometry'
import {Screen} from './Screen'
import {View} from './View'
import type {MouseEventListenerName} from './events'

/**
 * Defines a region (size) in which to draw, and a subset (visibleRect) that is
 * on-screen. Anything not in the rect is considered invisible (and any drawing
 * outside the rect will be clipped)
 */
export class Viewport {
  readonly contentSize: Size
  readonly visibleRect: Rect
  readonly terminal: Terminal

  #offset: Point
  #screen: Screen
  #style: Style

  constructor(
    screen: Screen,
    terminal: Terminal | Viewport,
    contentSize: Size,
    visibleRect: Rect,
    offset?: Point,
    style?: Style,
  ) {
    this.#screen = screen
    if (terminal instanceof Viewport) {
      this.terminal = terminal.terminal
    } else {
      this.terminal = terminal
    }

    this.contentSize = contentSize
    this.visibleRect = visibleRect
    this.#offset = offset ?? Point.zero
    this.#style = style ?? Style.NONE

    Object.defineProperty(this, 'terminal', {
      enumerable: false,
    })
  }

  registerFocus(view: View) {
    return this.#screen.registerFocus(view)
  }

  hasFocus(view: View) {
    return this.#screen.hasFocus(view)
  }

  // nextFocus() {
  //   this.#screen.nextFocus()
  // }

  /**
   * @see MouseManager.registerMouse
   */
  registerMouse(
    view: View,
    eventNames: MouseEventListenerName | MouseEventListenerName[],
    rect?: Rect,
  ) {
    if (rect) {
      rect = this.visibleRect.intersection(rect)
    } else {
      rect = this.visibleRect
    }
    const maxX = rect.maxX()
    const maxY = rect.maxY()
    for (let y = rect.minY(); y < maxY; ++y)
      for (let x = rect.minX(); x < maxX; ++x) {
        this.#screen.registerMouse(
          view,
          this.#offset,
          new Point(x, y),
          typeof eventNames === 'string' ? [eventNames] : eventNames,
        )
      }
  }

  registerTick(view: View) {
    return this.#screen.registerTick(view)
  }

  /**
   * Does not support newlines (no default wrapping behavior),
   * always prints left-to-right.
   */
  write(input: string, to: Point, defaultStyle?: Style) {
    if (
      to.x >= this.visibleRect.maxX() ||
      to.y < this.visibleRect.minY() ||
      to.y >= this.visibleRect.maxY()
    ) {
      return
    }

    defaultStyle ??= this.#style
    let x = to.x
    let style = defaultStyle
    for (const char of unicode.printableChars(input)) {
      if (char === '\n') {
        break
      }

      const width = unicode.charWidth(char)
      if (width === 0) {
        style =
          char === RESET
            ? defaultStyle
            : defaultStyle.merge(Style.fromSGR(char))
      } else if (
        x >= this.visibleRect.minX() &&
        x + width - 1 < this.visibleRect.maxX()
      ) {
        this.terminal.writeChar(
          char,
          this.#offset.x + x,
          this.#offset.y + to.y,
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

  usingPen(style: Style | undefined, draw: (pen: Pen) => void): void
  usingPen(draw: (pen: Pen) => void): void
  usingPen(
    ...args: [Style | undefined, (pen: Pen) => void] | [(pen: Pen) => void]
  ): void {
    const prevStyle = this.#style
    const pen = new Pen((style?: Style) => {
      this.#style = style ?? prevStyle
    })

    if (args.length === 2) {
      if (args[0] && args[0] !== Style.NONE) {
        pen.replacePen(args[0])
      }
      args[1](pen)
    } else {
      args[0](pen)
    }
    this.#style = prevStyle
  }

  clipped(clip: Rect, draw: (viewport: Viewport) => void): void
  clipped(clip: Rect, style: Style, draw: (viewport: Viewport) => void): void
  clipped(
    ...args:
      | [Rect, (viewport: Viewport) => void]
      | [Rect, Style, (viewport: Viewport) => void]
  ) {
    let clip: Rect
    let style: Style
    let draw: (viewport: Viewport) => void
    if (args.length === 3) {
      ;[clip, style, draw] = args
    } else {
      ;[clip, draw] = args
      style = Style.NONE
    }

    const offsetX = this.#offset.x + clip.origin.x
    const offsetY = this.#offset.y + clip.origin.y
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

    draw(
      new Viewport(this.#screen, this, contentSize, visibleRect, offset, style),
    )
  }
}

class Pen {
  #setter: (style?: Style) => void
  #stack: Style[]

  constructor(setter: (style?: Style) => void) {
    this.#setter = setter
    this.#stack = []
  }

  replacePen(style: Style) {
    this.#stack[0] = style
    this.#setter(style)
  }

  pushPen(style: Style | undefined = undefined) {
    style ??= this.#stack[0] ?? Style.NONE
    // yeah I know I said pushPen but #style[0] is easier!
    this.#stack.unshift(style)
    this.#setter(style)
  }

  popPen() {
    this.#setter(this.#stack.shift())
  }
}
