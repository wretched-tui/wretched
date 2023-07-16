import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size, MutablePoint} from '../geometry'

type Direction = 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop'

interface Props extends ViewProps {
  children: View[]
  direction: Direction
}

export class Flow extends Container {
  direction: Direction

  constructor({children, direction, ...viewProps}: Props) {
    super(viewProps)
    this.direction = direction

    for (const child of children) {
      this.add(child)
    }
  }

  intrinsicSize(availableSize: Size): Size {
    const size = Size.zero.mutableCopy()
    const remainingSize = availableSize.mutableCopy()
    for (const child of this.children) {
      const childSize = child.intrinsicSize(availableSize)
      if (isVertical(this.direction)) {
        remainingSize.height = Math.max(
          0,
          remainingSize.height - childSize.height,
        )
        size.width = Math.max(size.width, childSize.width)
        size.height += childSize.height
      } else {
        remainingSize.width = Math.max(0, remainingSize.width - childSize.width)
        size.width += childSize.width
        size.height = Math.max(size.height, childSize.height)
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
      const childSize = child.intrinsicSize(viewport.contentSize).mutableCopy()
      if (isVertical(this.direction)) {
        childSize.width = viewport.contentSize.width
      } else {
        childSize.height = viewport.contentSize.height
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

      if (this.direction === 'leftToRight') {
        origin.x += childSize.width
      } else if (this.direction === 'topToBottom') {
        origin.y += childSize.height
      }

      if (isVertical(this.direction)) {
        remainingSize.height = Math.max(
          0,
          remainingSize.height - childSize.height,
        )
      } else {
        remainingSize.width = Math.max(0, remainingSize.width - childSize.width)
      }

      if (remainingSize.width <= 0 || remainingSize.height <= 0) {
        break
      }
    }
  }
}

function isVertical(direction: Direction) {
  return direction === 'topToBottom' || direction === 'bottomToTop'
}
