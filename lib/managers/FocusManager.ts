import {View} from '../View'
import {match, type HotKey, type KeyEvent} from '../events'

export class FocusManager {
  #currentFocus: View | undefined
  #prevFocus: View | undefined
  #focusRing: View[] = []
  #hotKeys: [View, HotKey][] = []

  /**
   * If the previous focus-view is not mounted, we can clear out the current
   * focus-view and focus the first that registers.
   *
   * If the previous focus-view is mounted but does not request focus, we can't know
   * that until _after_ the first render. In that case, after render, 'needsRerender'
   * selects the first focus-view and triggers a re-render.
   */
  reset(rootView: View) {
    const prevIsMounted =
      this.#currentFocus && findView(rootView, this.#currentFocus)
    if (prevIsMounted) {
      this.#prevFocus = this.#currentFocus
    } else {
      this.#prevFocus = undefined
    }
    this.#currentFocus = undefined
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
      if (event.shift) {
        this.prevFocus()
      } else {
        this.nextFocus()
      }
    } else if (this.#currentFocus) {
      this.#currentFocus.receiveKey(event)
    }
  }

  /**
   * Returns whether the current view has focus.
   */
  registerFocus(view: View) {
    this.#focusRing.push(view)

    if (!this.#currentFocus && (!this.#prevFocus || this.#prevFocus === view)) {
      this.#currentFocus = view
      return true
    } else {
      return false
    }
  }

  registerHotKey(view: View, key: HotKey) {
    return this.#hotKeys.push([view, key])
  }

  needsRerender() {
    if (this.#focusRing.length > 0 && this.#prevFocus && !this.#currentFocus) {
      this.#prevFocus = undefined
      this.#currentFocus = this.#focusRing.shift()
      return true
    } else {
      return false
    }
  }

  #reorderRing() {
    if (this.#currentFocus && this.#focusRing[0] !== this.#currentFocus) {
      const index = this.#focusRing.indexOf(this.#currentFocus)
      if (~index) {
        const pre = this.#focusRing.slice(0, index)
        this.#focusRing = this.#focusRing.slice(index).concat(pre)
      }
    }
  }

  prevFocus() {
    this.#reorderRing()

    const last = this.#focusRing.pop()
    if (last) {
      this.#focusRing.unshift(last)
      this.#currentFocus = this.#focusRing[0]
    }

    return this.#currentFocus
  }

  nextFocus() {
    this.#reorderRing()

    const first = this.#focusRing.shift()
    if (first) {
      this.#focusRing.push(first)
      this.#currentFocus = this.#focusRing[0]
    }

    return this.#currentFocus
  }
}

function findView(parent: View, prevFocus: View): boolean {
  if (parent === prevFocus) {
    return true
  }

  return parent.children.some(child => findView(child, prevFocus))
}
