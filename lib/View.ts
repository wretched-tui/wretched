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

    Object.defineProperty(this, 'parent', {
      enumerable: false,
    })

    const render = this.render.bind(this)
    this.render = this.#render(render).bind(this)
    const intrinsicSize = this.intrinsicSize.bind(this)
    this.intrinsicSize = this.#intrinsicSize(intrinsicSize).bind(this)
  }

  get screen(): Screen | null {
    return this.#screen
  }

  #render(render: (viewport: Viewport) => void): (viewport: Viewport) => void {
    return (viewport: Viewport) => {
      if (this.#x || this.#y) {
        const [x, y] = [this.#x ?? 0, this.#y ?? 0]
        viewport.clipped(
          new Rect(new Point(x, y), viewport.contentSize.shrink(x, y)),
          render,
        )
      } else {
        render(viewport)
      }
    }
  }

  // intrinsicSize(availableSize: Size): Mutable<Size> {
  #intrinsicSize(
    intrinsicSize: (availableSize: Size) => Mutable<Size>,
  ): (availableSize: Size) => Mutable<Size> {
    return availableSize => {
      let size: Mutable<Size>
      if (this.#width !== undefined && this.#height !== undefined) {
        size = new Size(this.#width, this.#height).mutableCopy()
      } else {
        size = intrinsicSize(availableSize).mutableCopy()
        if (
          !this.#x &&
          !this.#y &&
          this.#minWidth === undefined &&
          this.#minHeight === undefined &&
          this.#maxWidth === undefined &&
          this.#maxHeight === undefined
        ) {
          return size
        }

        if (this.#minWidth !== undefined) {
          size.width = Math.max(this.#minWidth, size.width)
        }
        if (this.#minHeight !== undefined) {
          size.height = Math.max(this.#minHeight, size.height)
        }

        if (this.#maxWidth !== undefined) {
          size.width = Math.min(this.#maxWidth, size.width)
        }
        if (this.#maxHeight !== undefined) {
          size.height = Math.min(this.#maxHeight, size.height)
        }
      }

      if (this.#x) {
        size.width += this.#x
      }
      if (this.#y) {
        size.width += this.#y
      }

      return size
    }
  }

  abstract intrinsicSize(availableSize: Size): Size
  abstract render(viewport: Viewport): void

  willMoveTo(parent: View) {}
  didMoveFrom(parent: View) {}
  didMount(screen: Screen) {}
  didUnmount(screen: Screen) {}

  receiveKey(event: KeyEvent) {}
  receiveMouse(event: MouseEvent) {}
  receiveTick(dt: number): boolean | undefined {
    return
  }

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
