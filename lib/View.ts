import type {BlessedProgram} from './sys'
import type {MutableSize} from './geometry'
import {Size} from './geometry'
import type {Viewport} from './Viewport'
import type {Screen} from './Screen'
import type {KeyEvent, MouseEvent} from './events'

export interface Props {
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export abstract class View {
  parent: View | null = null
  #screen: Screen | null = null

  #minWidth: number | undefined
  #minHeight: number | undefined
  #maxWidth: number | undefined
  #maxHeight: number | undefined

  constructor({minWidth, minHeight, maxWidth, maxHeight}: Props = {}) {
    this.#minWidth = minWidth
    this.#minHeight = minHeight
    this.#maxWidth = maxWidth
    this.#maxHeight = maxHeight

    Object.defineProperty(this, 'parent', {
      enumerable: false,
    })
  }

  get screen(): Screen | null {
    return this.#screen
  }

  calculateIntrinsicSize(availableSize: Size): MutableSize {
    const size = this.intrinsicSize(availableSize).mutableCopy()
    if (
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
    return size
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
