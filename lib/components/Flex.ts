import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size, MutablePoint} from '../geometry'

type Direction = 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop'
type FlexSize =
  | 'intrinsic'
  | {flex: number}
  | 'flex' // implies {flex: 1}
  | `flex${number}` // {flex: number} shorthand

interface Props {
  children: ([FlexSize, View] | View)[]
  direction: Direction
}

export class Flex extends Container {
  direction: Direction
  sizes: Map<View, FlexSize> = new Map()

  constructor({children, direction}: Props) {
    super()
    this.direction = direction

    for (const info of children) {
      let flexSize: FlexSize, child: View
      if (info instanceof View) {
        flexSize = 'intrinsic'
        child = info
      } else {
        ;[flexSize, child] = info
      }
      this.sizes.set(child, flexSize)
      this.add(child)
    }
  }

  intrinsicSize(availableSize: Size): Size {
    const size = Size.zero.mutableCopy()
    let remainingSize =
      availableSize[isVertical(this.direction) ? 'height' : 'width']
    let hasFlex = false
    for (const child of this.children) {
      const flexSize = this.sizes.get(child) ?? 'intrinsic'
      const childSize = child.intrinsicSize(availableSize)
      if (flexSize === 'intrinsic') {
        if (isVertical(this.direction)) {
          remainingSize = Math.max(0, remainingSize - childSize.height)
          size.width = Math.max(size.width, childSize.width)
          size.height += childSize.height
        } else {
          remainingSize = Math.max(0, remainingSize - childSize.width)
          size.width += childSize.width
          size.height = Math.max(size.height, childSize.height)
        }
      } else {
        hasFlex = true
        if (isVertical(this.direction)) {
          size.width = Math.max(size.width, childSize.width)
          size.height = availableSize.height
        } else {
          size.width = availableSize.width
          size.height = Math.max(size.height, childSize.height)
        }
      }
    }

    if (hasFlex) {
      if (isVertical(this.direction)) {
        return new Size(size.width, availableSize.height)
      } else {
        return new Size(availableSize.width, size.height)
      }
    }

    return size
  }

  render(viewport: Viewport) {
    let remainingSize =
      viewport.contentSize[isVertical(this.direction) ? 'height' : 'width']

    let flexTotal = 0
    let flexCount = 0
    // first pass, calculate all the intrinsicSizes and subtract them from the
    // contentSize - leftovers are divided to the flex views. intrinsicSizes might
    // as well be memoized along with the flex amounts
    const flexViews: [FlexSize, number, View][] = []
    for (const child of this.children) {
      const flexSize = this.sizes.get(child) ?? 'intrinsic'
      if (flexSize === 'intrinsic') {
        const childSize = child
          .intrinsicSize(viewport.contentSize)
          .mutableCopy()
        if (isVertical(this.direction)) {
          flexViews.push([flexSize, childSize.height, child])
          remainingSize = Math.max(0, remainingSize - childSize.height)
        } else {
          flexViews.push([flexSize, childSize.width, child])
          remainingSize = Math.max(0, remainingSize - childSize.width)
        }
      } else {
        let flex: number
        if (flexSize === 'flex') {
          flex = 1
        } else if (typeof flexSize === 'string') {
          flex = +flexSize.slice(4) // 'flexN'
        } else {
          flex = flexSize.flex
        }
        flexTotal += flex
        flexViews.push([flexSize, flex, child])
        flexCount += 1
      }
    }

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

    // stores the leftover rounding errors, and added to view once it exceeds 1
    let correctAmount: number = 0

    // second pass, divide up the remainingSize to the flex views, subtracting off
    // of remainingSize. The last view receives any leftover height
    const totalRemainingSize = remainingSize
    for (const [flexSize, amount, child] of flexViews) {
      const childSize = viewport.contentSize.mutableCopy()

      if (flexSize === 'intrinsic') {
        if (isVertical(this.direction)) {
          childSize.height = amount
        } else {
          childSize.width = amount
        }
      } else {
        // rounding errors can compound, so we track the error and add it to subsequent
        // views; the last view receives the amount left in remainingSize (0..1)
        let size = (totalRemainingSize / flexTotal) * amount + correctAmount
        correctAmount = size - ~~size
        remainingSize -= ~~size

        // --flexCount === 0 checks for the last flex view
        if (--flexCount === 0) {
          size += remainingSize
        }

        if (isVertical(this.direction)) {
          childSize.height = ~~size
        } else {
          childSize.width = ~~size
        }
      }

      if (this.direction === 'rightToLeft') {
        origin.x -= childSize.width
      } else if (this.direction === 'bottomToTop') {
        origin.y -= childSize.height
      }

      viewport.clipped(new Rect(origin, childSize), inside => {
        child.render(inside)
      })

      if (this.direction === 'leftToRight') {
        origin.x += childSize.width
      } else if (this.direction === 'topToBottom') {
        origin.y += childSize.height
      }
    }
  }
}

function isVertical(direction: Direction) {
  return direction === 'topToBottom' || direction === 'bottomToTop'
}
