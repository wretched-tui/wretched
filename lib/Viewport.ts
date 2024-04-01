import {unicode} from './sys'

import type {Terminal} from './terminal'
import {RESET, BG_DRAW} from './ansi'
import {Style} from './Style'
import {Rect, Point, Size} from './geometry'
import {Screen} from './Screen'
import {View} from './View'
import type {HotKey, MouseEventListenerName} from './events'

/**
 * Defines a region (contentSize) in which to draw, and a subset (visibleRect) that
 * is on-screen. Anything not in the visibleRect is considered invisible (and any
 * drawing outside the rect will be clipped)
 */
export class Viewport {
  #terminal: Terminal
  #currentRender: View | null = null
  #contentSize: Size
  #visibleRect: Rect
  #offset: Point
  #screen: Screen
  #style: Style

  /**
   * For modals, this offset points to the Rect of the view that presented the modal
   */
  parentRect: Rect
  declare contentSize: Size
  declare contentRect: Rect
  declare visibleRect: Rect

  constructor(screen: Screen, terminal: Terminal, contentSize: Size) {
    const rect = new Rect(Point.zero, contentSize)
    this.#terminal = terminal
    this.#screen = screen
    this.#contentSize = contentSize
    this.parentRect = rect
    this.#visibleRect = rect
    this.#offset = Point.zero
    this.#style = Style.NONE

    // control visibility of props for inspect(viewport)
    Object.defineProperties(this, {
      contentSize: {
        enumerable: true,
        get: () => {
          return this.#contentSize
        },
      },
      contentRect: {
        enumerable: false,
        get: () => {
          return new Rect(Point.zero, this.#contentSize)
        },
      },
      visibleRect: {
        enumerable: true,
        get: () => {
          return this.#visibleRect
        },
      },
    })
  }

  /**
   * @return boolean Whether the modal creation was successful
   */
  requestModal(modal: View, onClose: () => void): boolean {
    if (!this.#currentRender) {
      return false
    }

    return this.#screen.requestModal(
      this.#currentRender,
      modal,
      onClose,
      new Rect(this.#offset, this.#contentSize),
    )
  }

  dismissModal(view: View) {
    this.#screen.dismissModal(view)
  }

  registerHotKey(key: HotKey) {
    if (!this.#currentRender) {
      return
    }

    this.#screen.registerHotKey(this.#currentRender, key)
  }

  /**
   * @return boolean Whether the current render target is the focus view
   */
  registerFocus(): boolean {
    if (!this.#currentRender) {
      return false
    }
    return this.#screen.registerFocus(this.#currentRender)
  }

  /**
   * @see MouseManager.registerMouse
   */
  registerMouse(
    eventNames: MouseEventListenerName | MouseEventListenerName[],
    rect?: Rect,
  ) {
    if (!this.#currentRender) {
      return
    }

    if (rect) {
      rect = this.#visibleRect.intersection(rect)
    } else {
      rect = this.#visibleRect
    }
    const maxX = rect.maxX()
    const maxY = rect.maxY()
    for (let y = rect.minY(); y < maxY; ++y)
      for (let x = rect.minX(); x < maxX; ++x) {
        this.#screen.registerMouse(
          this.#currentRender,
          this.#offset,
          new Point(x, y),
          typeof eventNames === 'string' ? [eventNames] : eventNames,
        )
      }
  }

  registerTick() {
    if (!this.#currentRender) {
      return
    }

    this.#screen.registerTick(this.#currentRender)
  }

  /**
   * Clears out, and optionally "paints" default foreground/background colors. If no
   * region is provided, the entire visibleRect is painted.
   */
  paint(defaultStyle: Style, region?: Point | Rect) {
    if (region instanceof Point) {
      this.write(' ', region, defaultStyle)
    } else {
      region ??= this.visibleRect
      region.forEachPoint(pt => this.paint(defaultStyle, pt))
    }
  }

  /**
   * Does not support newlines (no default wrapping behavior),
   * always prints left-to-right.
   */
  write(input: string, to: Point, defaultStyle?: Style) {
    const minX = this.#visibleRect.minX(),
      maxX = this.#visibleRect.maxX(),
      minY = this.#visibleRect.minY(),
      maxY = this.#visibleRect.maxY()
    if (to.x >= maxX || to.y < minY || to.y >= maxY) {
      return
    }

    defaultStyle ??= this.#style
    let x = to.x,
      style = defaultStyle
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
      } else if (x >= minX && x + width - 1 < maxX) {
        this.#terminal.writeChar(
          char,
          this.#offset.x + x,
          this.#offset.y + to.y,
          style,
        )
        if (this.#currentRender) {
          this.#screen.checkMouse(
            this.#currentRender,
            this.#offset.x + x,
            this.#offset.y + to.y,
          )
        }
      }

      x += width

      // no need to consider characters after this; newline/wrap isn't supported here
      if (x >= maxX) {
        break
      }
    }
  }

  /**
   * Forwards 'meta' ANSI sequences (see ITerm) to the terminal
   */
  writeMeta(str: string) {
    this.#terminal.writeMeta(str)
  }

  usingPen(style: Style | undefined, draw: (pen: Pen) => void): void
  usingPen(draw: (pen: Pen) => void): void
  usingPen(
    ...args: [Style | undefined, (pen: Pen) => void] | [(pen: Pen) => void]
  ) {
    const prevStyle = this.#style
    const pen = new Pen(prevStyle, (style?: Style) => {
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

  _render(view: View, clip: Rect, draw: (viewport: Viewport) => void): void {
    const prevRender = this.#currentRender
    this.#currentRender = view
    this.clipped(clip, draw)
    this.#currentRender = prevRender
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
      style = this.#style
    }

    const offsetX = this.#offset.x + clip.origin.x
    const offsetY = this.#offset.y + clip.origin.y
    const contentWidth = Math.max(0, clip.size.width)
    const contentHeight = Math.max(0, clip.size.height)

    const visibleMinX = Math.max(0, this.#visibleRect.origin.x - clip.origin.x)
    const visibleMinY = Math.max(0, this.#visibleRect.origin.y - clip.origin.y)
    const visibleMaxX = Math.min(
      clip.size.width,
      this.#visibleRect.origin.x + this.#visibleRect.size.width - clip.origin.x,
    )
    const visibleMaxY = Math.min(
      clip.size.height,
      this.#visibleRect.origin.y +
        this.#visibleRect.size.height -
        clip.origin.y,
    )

    const contentSize = new Size(contentWidth, contentHeight)
    const visibleRect = new Rect(
      new Point(visibleMinX, visibleMinY),
      new Size(visibleMaxX - visibleMinX, visibleMaxY - visibleMinY),
    )
    const offset = new Point(offsetX, offsetY)

    const prevContentSize = this.#contentSize
    const prevVisibleRect = this.#visibleRect
    const prevOffset = this.#offset
    const prevStyle = this.#style

    this.#contentSize = contentSize
    this.#visibleRect = visibleRect
    this.#offset = offset
    this.#style = style

    draw(this)

    this.#contentSize = prevContentSize
    this.#visibleRect = prevVisibleRect
    this.#offset = prevOffset
    this.#style = prevStyle
  }
}

class Pen {
  #setter: (style?: Style) => void
  #initial: Style
  #stack: Style[]

  constructor(initialStyle: Style, setter: (style?: Style) => void) {
    this.#setter = setter
    this.#initial = initialStyle
    this.#stack = []
  }

  mergePen(style: Style) {
    const current = this.#stack[0] ?? this.#initial
    style = current.merge(style)
    this.replacePen(style)
  }

  replacePen(style: Style) {
    this.#stack[0] = style
    this.#setter(style)
  }

  pushPen(style: Style | undefined = undefined) {
    style ??= this.#stack[0] ?? this.#initial
    // yeah I know I said pushPen but #style[0] is easier!
    this.#stack.unshift(style)
    this.#setter(style)
  }

  popPen() {
    this.#setter(this.#stack.shift())
  }
}
