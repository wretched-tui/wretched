import type {Mutable} from './geometry'
import type {Viewport} from './Viewport'
import type {Screen} from './Screen'
import {Theme} from './Theme'
import type {KeyEvent, MouseEvent} from './events'
import {Point, Size, Rect} from './geometry'

export interface Props {
  theme?: Theme
  x?: number
  y?: number
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export abstract class View {
  parent: View | null = null
  #screen: Screen | null = null
  #theme: Theme | undefined

  #x: Props['x']
  #y: Props['y']
  #width: Props['width']
  #height: Props['height']
  #minWidth: Props['minWidth']
  #minHeight: Props['minHeight']
  #maxWidth: Props['maxWidth']
  #maxHeight: Props['maxHeight']

  constructor({
    theme,
    x,
    y,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
  }: Props = {}) {
    this.#theme = theme
    this.#x = x
    this.#y = y
    this.#width = width
    this.#height = height
    this.#minWidth = minWidth
    this.#minHeight = minHeight
    this.#maxWidth = maxWidth
    this.#maxHeight = maxHeight

    const render = this.render.bind(this)
    this.render = this.#renderWrap(render).bind(this)
    const intrinsicSize = this.intrinsicSize.bind(this)
    this.intrinsicSize = this.#intrinsicSizeWrap(intrinsicSize).bind(this)

    Object.defineProperties(this, {
      render: {
        enumerable: false,
      },
      intrinsicSize: {
        enumerable: false,
      },
      parent: {
        enumerable: false,
      },
    })
  }

  get theme(): Theme {
    return this.#theme ?? this.parent?.theme ?? Theme.default
  }

  get screen(): Screen | null {
    return this.#screen
  }

  #restrictSize(availableSize: () => Size): Mutable<Size> {
    if (this.#width !== undefined && this.#height !== undefined) {
      return new Size(this.#width, this.#height).mutableCopy()
    }

    const size = availableSize().mutableCopy()

    if (this.#width !== undefined) {
      size.width = this.#width
    } else {
      if (this.#minWidth !== undefined) {
        size.width = Math.max(this.#minWidth, size.width)
      }
      if (this.#maxWidth !== undefined) {
        size.width = Math.min(this.#maxWidth, size.width)
      }
    }

    if (this.#height !== undefined) {
      size.height = this.#height
    } else {
      if (this.#minHeight !== undefined) {
        size.height = Math.max(this.#minHeight, size.height)
      }
      if (this.#maxHeight !== undefined) {
        size.height = Math.min(this.#maxHeight, size.height)
      }
    }

    return size
  }

  #intrinsicSizeWrap(
    intrinsicSize: (availableSize: Size) => Mutable<Size>,
  ): (availableSize: Size) => Mutable<Size> {
    return availableSize => {
      if (this.#x || this.#y) {
        availableSize = availableSize.shrink(this.#x ?? 0, this.#y ?? 0)
      }

      const size = this.#restrictSize(() => intrinsicSize(availableSize))
      if (this.#x) {
        size.width += this.#x
      }
      if (this.#y) {
        size.height += this.#y
      }

      return size
    }
  }

  #renderWrap(
    render: (viewport: Viewport) => void,
  ): (viewport: Viewport) => void {
    return viewport => {
      const prevRender = viewport._currentRender
      viewport._currentRender = this

      let origin: Point
      let contentSize: Size = viewport.contentSize
      if (this.#x || this.#y) {
        origin = new Point(this.#x ?? 0, this.#y ?? 0)
        contentSize = contentSize.shrink(origin.x, origin.y)
      } else {
        origin = Point.zero
      }

      const renderSize = this.#restrictSize(() => contentSize)

      const rect = new Rect(origin, renderSize)
      viewport.clipped(rect, render)

      viewport._currentRender = prevRender
    }
  }

  abstract intrinsicSize(availableSize: Size): Size
  abstract render(viewport: Viewport): void

  receiveKey(event: KeyEvent) {}
  receiveMouse(event: MouseEvent) {}
  receiveTick(dt: number): boolean | undefined {
    return
  }

  willMoveTo(parent: View) {}
  didMoveFrom(parent: View) {}
  didMount(screen: Screen) {}
  didUnmount(screen: Screen) {}

  moveToScreen(screen: Screen | null) {
    if (this.#screen !== screen) {
      const prev = this.#screen
      this.#screen = screen

      if (screen) {
        if (prev) {
          this.didUnmount(prev)
        }
        this.didMount(screen)
      } else {
        this.didUnmount(prev!)
      }
    }
  }
}
