import {Size} from './geometry'
import type {Viewport} from './Viewport'
import {View} from './View'
import {Screen} from './Screen'

export abstract class Container extends View {
  #children: View[] = []

  get children() {
    return this.#children
  }

  naturalSize(availableSize: Size): Size {
    let width = 0
    let height = 0
    for (const child of this.#children) {
      const naturalSize = child.naturalSize(availableSize)
      width = Math.max(width, naturalSize.width)
      height = Math.max(height, naturalSize.height)
    }
    return new Size(width, height)
  }

  render(viewport: Viewport) {
    this.renderChildren(viewport)
  }

  renderChildren(viewport: Viewport) {
    for (const child of this.#children) {
      child.render(viewport)
    }
  }

  addAll(children: View[], at?: number) {
    for (const view of children) {
      this.add(view, at)
      at = at !== undefined ? at + 1 : undefined
    }
  }

  add(child: View, at?: number) {
    // don't call 'remove' - we don't want to call didUnmount, and only call
    // didMoveFrom if we changed from one parent view to another
    if (child.parent === this) {
      this.#children = this.#children.filter(view => view !== child)
    } else {
      child.willMoveTo(this)
      if (child.parent && child.parent instanceof Container) {
        const index = child.parent.#children.indexOf(child)
        if (~index) {
          child.parent.#children.splice(index, 1)
        }
      }
    }

    this.#children.splice(at ?? this.#children.length, 0, child)

    if (child.parent !== this) {
      const parent = child.parent
      child.parent = this
      if (parent) {
        child.didMoveFrom(parent)
      }
    }
    // in theory we could call 'didReorder' in the else clause

    // takes care of didMount
    child.moveToScreen(this.screen)
  }

  removeChild(remove: View | number) {
    if (typeof remove === 'number') {
      if (remove >= 0 && remove < this.#children.length) {
        const child = this.#children[remove]
        this.#children.splice(remove, 1)
        child.parent = null
        child.didMoveFrom(this)

        // takes care of didUnmount
        child.moveToScreen(null)
      }
    } else {
      if (remove.parent !== this) {
        return
      }

      const index = this.#children.indexOf(remove)
      if (~index) {
        this.removeChild(index)
      }
    }
  }

  moveToScreen(screen: Screen | null) {
    super.moveToScreen(screen)

    for (const child of this.#children) {
      child.moveToScreen(this.screen)
    }
  }
}
