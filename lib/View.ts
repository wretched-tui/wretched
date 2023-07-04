import {Size} from './geometry'
import type {Viewport} from './Viewport'
import type {Screen} from './Screen'

export abstract class View {
  #screen: Screen | null
  get screen(): Screen | null {
    return this.#screen
  }

  parent: View | null

  constructor() {
    this.parent = null
    this.#screen = null
  }

  abstract intrinsicSize(size: Size): Size
  abstract render(viewport: Viewport): void

  willMoveTo(parent: View) {}
  didMoveFrom(parent: View) {}
  didMount() {}
  didUnmount() {}

  moveToScreen(screen: Screen | null) {
    if (this.#screen !== screen) {
      this.#screen = screen
      this.didMoveToScreen(screen)

      if (screen) {
        this.didMount()
      } else {
        this.didUnmount()
      }
    }
  }

  didMoveToScreen(screen: Screen | null) {}
}
