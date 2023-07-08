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
  didMount(screen: Screen) {}
  didUnmount(screen: Screen) {}

  receiveMouse(event: MouseEvent) {}

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
