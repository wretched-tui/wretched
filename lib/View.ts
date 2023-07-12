import type {BlessedProgram} from './sys'
import {Size} from './geometry'
import type {Viewport} from './Viewport'
import type {Screen} from './Screen'
import type {KeyEvent, MouseEvent} from './events'

export abstract class View {
  parent: View | null = null
  #screen: Screen | null = null

  constructor() {
    Object.defineProperty(this, 'parent', {
      enumerable: false,
    })
  }

  get screen(): Screen | null {
    return this.#screen
  }

  abstract intrinsicSize(size: Size): Size
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
