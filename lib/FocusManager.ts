import {View} from './View'
import type {KeyEvent} from './events'

export class FocusManager {
  #currentFocus: View | undefined
  #prevFocus: View | undefined
  #focusRing: View[] = []

  reset() {
    this.#focusRing = []
  }

  trigger(event: KeyEvent) {
    if (event.name === 'tab') {
      this.#prevFocus = this.nextFocus()
    } else if (this.#currentFocus) {
      this.#currentFocus.receiveKey(event)
    }
  }

  hasFocus(view: View) {
    if (this.#currentFocus) {
      return this.#currentFocus === view
    }
    return this.#focusRing[0] === view
  }

  addFocus(view: View) {
    this.#focusRing.push(view)
    this.#currentFocus ??= view
  }

  nextFocus(): View | undefined {
    if (this.#currentFocus && this.#focusRing[0] !== this.#currentFocus) {
      const index = this.#focusRing.indexOf(this.#currentFocus)
      if (~index) {
        const pre = this.#focusRing.slice(0, index)
        this.#focusRing = this.#focusRing.slice(index).concat(pre)
      }
    }

    const first = this.#focusRing.shift()
    if (first) {
      this.#focusRing.push(first)
      this.#currentFocus = this.#focusRing[0]
    }

    return this.#currentFocus
  }
}
