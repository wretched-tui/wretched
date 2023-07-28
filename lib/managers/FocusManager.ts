import {View} from '../View'
import {match, type HotKey, type KeyEvent} from '../events'

export class FocusManager {
  #currentFocus: View | undefined
  #prevFocus: View | undefined
  #focusRing: View[] = []
  #hotKeys: [View, HotKey][] = []
  reset() {
    this.#focusRing = []
    this.#hotKeys = []
  }

  trigger(event: KeyEvent) {
    for (const [view, key] of this.#hotKeys) {
      if (match(key, event)) {
        return view.receiveKey(event)
      }
    }

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

  registerFocus(view: View) {
    this.#focusRing.push(view)
    this.#currentFocus ??= view
    return this.#currentFocus === view
  }

  registerHotKey(view: View, key: HotKey) {
    return this.#hotKeys.push([view, key])
  }

  needsRerender() {
    if (this.#currentFocus && !this.#focusRing.includes(this.#currentFocus)) {
      this.#currentFocus = this.#focusRing[0]
      return true
    } else {
      return false
    }
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
