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
  readonly #offset: Point
  readonly terminal: Terminal
  #screen: Screen
  #pen: Style

  constructor(
    screen: Screen,
    terminal: Terminal | Viewport,
    contentSize: Size,
    visibleRect: Rect,
    offset?: Point,
    pen?: Style,
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
    this.#pen = pen ?? Style.NONE
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
  #registerMouse(view: View, eventNames: MouseEventListenerName[]) {
    const maxX = this.visibleRect.maxX()
    const maxY = this.visibleRect.maxY()
    for (let y = this.visibleRect.minY(); y < maxY; ++y)
      for (let x = this.visibleRect.minX(); x < maxX; ++x) {
        this.#screen.registerMouse(
          view,
          this.#offset,
          new Point(x, y),
          eventNames,
        )
      }
  }

  registerTick(view: View) {
    return this.#screen.registerTick(view)
  }

  claim(view: View, draw: (writer: Writer) => void): void
  claim(view: View, style: Style, draw: (writer: Writer) => void): void
  claim(
    ...args:
      | [View, (writer: Writer) => void]
      | [View, Style, (writer: Writer) => void]
  ) {
    let view: View
    let style: Style
    let draw: (writer: Writer) => void
    if (args.length === 3) {
      if (args[1] === Style.NONE) {
        args[1] = this.#pen
      }
      ;[view, style, draw] = args
    } else {
      ;[view, draw] = args
      style = this.#pen
    }
    const registerMouseArgs: [
      view: View,
      eventNames: MouseEventListenerName[],
    ][] = []
    draw(
      new Writer(view, style, {
        write: this.#write.bind(this),
        registerMouse: (view: View, eventNames: MouseEventListenerName[]) =>
          registerMouseArgs.unshift([view, eventNames]),
      }),
    )
    for (const [view, eventNames] of registerMouseArgs) {
      this.#registerMouse(view, eventNames)
    }
  }

  /**
   * Does not support newlines (no default wrapping behavior),
   * always prints left-to-right.
   */
  #write(view: View, input: string, to: Point, pen: Style) {
    if (
      to.x >= this.visibleRect.maxX() ||
      to.y < this.visibleRect.minY() ||
      to.y >= this.visibleRect.maxY()
    ) {
      return
    }

    let x = to.x
    let style = pen
    for (const char of unicode.printableChars(input)) {
      if (char === '\n') {
        break
      }

      const width = unicode.charWidth(char)
      if (width === 0) {
        style = char === RESET ? pen : pen.merge(Style.fromSGR(char))
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

class Writer {
  #view: View
  #pen: Style[]
  #write: (view: View, input: string, to: Point, style: Style) => void
  #registerMouse: (view: View, eventNames: MouseEventListenerName[]) => void

  constructor(
    view: View,
    style: Style,
    fns: {
      write(view: View, input: string, to: Point, style: Style): void
      registerMouse(view: View, eventNames: MouseEventListenerName[]): void
    },
  ) {
    this.#view = view
    this.#pen = [style]
    this.#write = fns.write
    this.#registerMouse = fns.registerMouse
  }

  write(input: string, to: Point) {
    this.#write(this.#view, input, to, this.#pen[0])
  }

  replacePen(style: Style) {
    this.#pen[0] = style
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

  registerMouse(view: View, ...eventNames: MouseEventListenerName[]) {
    this.#registerMouse(view, eventNames)
  }
}
