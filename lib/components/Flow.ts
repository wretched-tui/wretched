import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size, MutablePoint} from '../geometry'

type Direction = 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop'

interface Props extends ViewProps {
  children: View[]
  direction: Direction
  spaceBetween?: number
}

export class Flow extends Container {
  direction: Direction
  #spaceBetween: number
  constructor({children, direction, spaceBetween, ...viewProps}: Props) {
    super(viewProps)
    this.direction = direction
    this.#spaceBetween = spaceBetween ?? 0
    for (const child of children) {
      this.add(child)
    }
  }

  naturalSize(availableSize: Size): Size {
    const remainingSize = availableSize.mutableCopy()
    const size = Size.zero.mutableCopy()
    for (const child of this.children) {
      const childSize = child.naturalSize(remainingSize)
      if (isVertical(this.direction)) {
        if (size.height > 0) {
          size.height += this.#spaceBetween
        }
        size.width = Math.max(size.width, childSize.width)
        size.height += childSize.height
        remainingSize.height -= childSize.height + this.#spaceBetween
      } else {
        if (size.width > 0) {
          size.width += this.#spaceBetween
        }
        size.width += childSize.width
        size.height = Math.max(size.height, childSize.height)
        remainingSize.width -= childSize.width + this.#spaceBetween
      }
    }

    return size
  }

  render(viewport: Viewport) {
    const remainingSize = viewport.contentSize.mutableCopy()
    let origin: MutablePoint
    switch (this.direction) {
      case 'leftToRight':
      case 'topToBottom':
        origin = Point.zero.mutableCopy()
        break
      case 'rightToLeft':
        origin = new Point(viewport.contentSize.width, 0)
        break
      case 'bottomToTop':
        origin = new Point(0, viewport.contentSize.height)
        break
    }

    const minVisibleX = viewport.visibleRect.minX(),
      maxVisibleX = viewport.visibleRect.maxX()
    for (const child of this.children) {
      const childSize = child.naturalSize(remainingSize).mutableCopy()
      if (isVertical(this.direction)) {
        childSize.width = viewport.contentSize.width
        remainingSize.height -= childSize.height + this.#spaceBetween
      } else {
        childSize.height = viewport.contentSize.height
        remainingSize.width -= childSize.width + this.#spaceBetween
      }

      if (this.direction === 'rightToLeft') {
        origin.x -= childSize.width
      } else if (this.direction === 'bottomToTop') {
        origin.y -= childSize.height
      }

      const childRect = new Rect(origin, childSize)
      if (childRect.minX() < maxVisibleX && childRect.maxX() >= minVisibleX) {
        viewport.clipped(childRect, inside => {
          child.render(inside)
        })
      }

      if (remainingSize.width <= 0 || remainingSize.height <= 0) {
        break
      }

      if (this.direction === 'rightToLeft') {
        origin.x -= this.#spaceBetween
      } else if (this.direction === 'bottomToTop') {
        origin.y -= this.#spaceBetween
      }

      if (this.direction === 'leftToRight') {
        origin.x += childSize.width + this.#spaceBetween
      } else if (this.direction === 'topToBottom') {
        origin.y += childSize.height + this.#spaceBetween
      }
    }
  }
}

function isVertical(direction: Direction) {
  return direction === 'topToBottom' || direction === 'bottomToTop'
}
