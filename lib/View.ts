import type {Mutable} from './geometry'
import {Point, Size, Rect} from './geometry'
import type {Viewport} from './Viewport'
import type {Screen} from './Screen'
import type {KeyEvent, MouseEvent} from './events'

export interface Props {
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
  #currentRender: View | null = null

  #x: number | undefined
  #y: number | undefined
  #width: number | undefined
  #height: number | undefined
  #minWidth: number | undefined
  #minHeight: number | undefined
  #maxWidth: number | undefined
  #maxHeight: number | undefined

  constructor({
    x,
    y,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
  }: Props = {}) {
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

  get screen(): Screen | null {
    return this.#screen
  }

  #renderWrap(
    render: (viewport: Viewport) => void,
  ): (viewport: Viewport) => void {
    return viewport => {
      const prevRender = viewport._currentRender
      viewport._currentRender = this
      if (this.#x || this.#y) {
        const [x, y] = [this.#x ?? 0, this.#y ?? 0]
        const rect = new Rect(
          new Point(x, y),
          viewport.contentSize.shrink(x, y),
        )
        viewport.clipped(rect, render)
      } else {
        render(viewport)
      }
      viewport._currentRender = prevRender
    }
  }

  #intrinsicSizeWrap(
    intrinsicSize: (availableSize: Size) => Mutable<Size>,
  ): (availableSize: Size) => Mutable<Size> {
    return availableSize => {
      let size: Mutable<Size>
      if (this.#width !== undefined && this.#height !== undefined) {
        size = new Size(this.#width, this.#height).mutableCopy()
      } else {
        size = intrinsicSize(availableSize).mutableCopy()

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
      }

      if (this.#x) {
        size.width += this.#x
      }
      if (this.#y) {
        size.height += this.#y
      }

      return size
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
