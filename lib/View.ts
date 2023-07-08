import type {BlessedProgram} from './sys'
import {Size} from './geometry'
import type {Viewport} from './Viewport'
import type {Screen} from './Screen'
import type {MouseEvent} from './events'

export abstract class View {
  parent: View | null = null
  #screen: Screen | null = null

  get screen(): Screen | null {
    return this.#screen
  }

  abstract intrinsicSize(size: Size): Size
  abstract render(viewport: Viewport): void

  willMoveTo(parent: View) {}
  didMoveFrom(parent: View) {}
  didMount() {}
  didUnmount() {}

  receiveMouse(event: MouseEvent) {}

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
