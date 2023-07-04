import type {Color} from './types'
import {Size} from './geometry'
import type {Viewport} from './Viewport'

export class View {
  parent: View | null
  children: View[] = []
  fg?: Color
  bg?: Color

  constructor() {
    this.parent = null
  }

  intrinsicSize(size: Size): Size {
    let width = 0
    let height = 0
    for (const child of this.children) {
      const intrinsicSize = child.intrinsicSize(size)
      width = Math.max(width, intrinsicSize.width)
      height = Math.max(height, intrinsicSize.height)
    }
    return new Size(width, height)
  }

  render(viewport: Viewport) {
    for (const child of this.children) {
      child.render(viewport)
    }
  }

  willMoveTo(parent: View) {}
  didMoveFrom(parent: View) {}
  didMount() {}
  didUnmount() {}

  add(child: View, at?: number) {
    // don't call 'remove' - we don't want to call didUnmount, and only call
    // didMoveFrom if we changed from one parent view to another
    if (child.parent === this) {
      this.children = this.children.filter(view => view !== child)
    } else {
      child.willMoveTo(this)
      const index = child.parent?.children.indexOf(child)
      if (index !== undefined && index !== -1) {
        child.parent!.children.splice(index, 1)
      }
    }

    this.children.splice(at ?? this.children.length, 0, child)

    if (child.parent !== this) {
      const parent = child.parent
      child.parent = this
      if (parent) {
        child.didMoveFrom(parent)
      } else {
        child.didMount()
      }
    }
    // in theory we could call 'didReorder' in the else clause
  }

  remove(remove: View | number) {
    if (typeof remove === 'number') {
      if (remove >= 0 && remove < this.children.length) {
        const child = this.children[remove]
        this.children.splice(remove, 1)
        child.parent = null
        child.didMoveFrom(this)
        child.didUnmount()
      }
    } else {
      if (remove.parent !== this) {
        return
      }

      const index = this.children.indexOf(remove)
      if (index !== -1) {
        this.remove(index)
      }
    }
  }
}
