import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View, parseFlexShorthand} from '../View'
import type {FlexShorthand, FlexSize} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size, MutablePoint} from '../geometry'

type Direction = 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop'

interface Props extends ViewProps {
  children?: ([FlexShorthand, View] | View)[]
  direction: Direction
}

type ShorthandProps = NonNullable<Props['children']> | Omit<Props, 'direction'>

function fromShorthand(props: ShorthandProps, direction: Direction): Props {
  if (props instanceof Array) {
    return {children: props, direction}
  } else {
    return {...props, direction}
  }
}

export class Flex extends Container {
  direction: Direction
  #sizes: Map<View, FlexSize> = new Map()

  static down(props: ShorthandProps) {
    const direction: Direction = 'topToBottom'
    return new Flex(fromShorthand(props, direction))
  }
  static up(props: ShorthandProps) {
    const direction: Direction = 'bottomToTop'
    return new Flex(fromShorthand(props, direction))
  }
  static right(props: ShorthandProps) {
    const direction: Direction = 'leftToRight'
    return new Flex(fromShorthand(props, direction))
  }
  static left(props: ShorthandProps) {
    const direction: Direction = 'rightToLeft'
    return new Flex(fromShorthand(props, direction))
  }

  constructor({children, direction, ...viewProps}: Props) {
    super(viewProps)
    this.direction = direction

    if (children) {
      for (const info of children) {
        let flexSize: FlexShorthand, child: View
        if (info instanceof View) {
          flexSize = info.flex
          child = info
        } else {
          ;[flexSize, child] = info

          flexSize = parseFlexShorthand(flexSize)
        }
        this.addFlex(flexSize, child)
      }
    }
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({direction}: Props) {
    this.direction = direction
  }

  naturalSize(availableSize: Size): Size {
    const size = Size.zero.mutableCopy()
    let remainingSize =
      availableSize[isVertical(this.direction) ? 'height' : 'width']
    let hasFlex = false
    for (const child of this.children) {
      const flexSize = this.#sizes.get(child) ?? 'natural'
      const availableChildSize = isVertical(this.direction)
        ? new Size(availableSize.width, remainingSize)
        : new Size(remainingSize, availableSize.height)
      const childSize = child.naturalSize(availableChildSize)
      if (flexSize === 'natural') {
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
        } else {
          size.height = Math.max(size.height, childSize.height)
        }
      }
    }

    if (hasFlex) {
      if (isVertical(this.direction)) {
        return new Size(size.width, Math.max(size.height, availableSize.height))
      } else {
        return new Size(Math.max(size.width, availableSize.width), size.height)
      }
    }

    return size
  }

  add(child: View, at?: number) {
    super.add(child, at)
    this.#sizes.set(child, child.flex)
  }

  addFlex(flexSize: FlexSize, child: View, at?: number) {
    super.add(child, at)
    this.#sizes.set(child, flexSize)
  }

  render(viewport: Viewport) {
    let remainingSize =
      viewport.contentSize[isVertical(this.direction) ? 'height' : 'width']

    let flexTotal = 0
    let flexCount = 0
    // first pass, calculate all the naturalSizes and subtract them from the
    // contentSize - leftovers are divided to the flex views. naturalSizes might
    // as well be memoized along with the flex amounts
    const flexViews: [FlexSize, number, View][] = []
    for (const child of this.children) {
      const flexSize = this.#sizes.get(child) ?? 'natural'
      if (flexSize === 'natural') {
        const availableChildSize = isVertical(this.direction)
          ? new Size(viewport.contentSize.width, remainingSize)
          : new Size(remainingSize, viewport.contentSize.height)
        const childSize = child.naturalSize(availableChildSize)
        if (isVertical(this.direction)) {
          flexViews.push(['natural', childSize.height, child])
          remainingSize = Math.max(0, remainingSize - childSize.height)
        } else {
          flexViews.push(['natural', childSize.width, child])
          remainingSize = Math.max(0, remainingSize - childSize.width)
        }
      } else {
        flexTotal += flexSize
        flexViews.push([flexSize, flexSize, child])
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

      if (flexSize === 'natural') {
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
