import type {Viewport} from '../Viewport'
import {type Props as ViewProps, View, parseFlexShorthand} from '../View'
import type {FlexShorthand, FlexSize} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size, MutablePoint} from '../geometry'

type Direction = 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop'

interface Props extends ViewProps {
  children?: ([FlexShorthand, View] | View)[]
  direction?: Direction
  fill?: boolean
  gap?: number
}

type ShorthandProps = NonNullable<Props['children']> | Omit<Props, 'direction'>

function fromShorthand(
  props: ShorthandProps,
  direction: Direction,
  extraProps: Omit<Props, 'children' | 'direction'> = {},
): Props {
  if (Array.isArray(props)) {
    return {children: props, direction, ...extraProps}
  } else {
    return {...props, direction, ...extraProps}
  }
}

export class Flex extends Container {
  #direction: Direction = 'topToBottom'
  #gap: number = 0
  #fill: boolean = false
  #sizes: Map<View, FlexSize> = new Map()

  static down(
    props: ShorthandProps = {},
    extraProps: Omit<Props, 'children' | 'direction'> = {},
  ): Flex {
    const direction: Direction = 'topToBottom'
    return new Flex(fromShorthand(props, direction, extraProps))
  }

  static up(
    props: ShorthandProps = {},
    extraProps: Omit<Props, 'children' | 'direction'> = {},
  ): Flex {
    const direction: Direction = 'bottomToTop'
    return new Flex(fromShorthand(props, direction, extraProps))
  }

  static right(
    props: ShorthandProps = {},
    extraProps: Omit<Props, 'children' | 'direction'> = {},
  ): Flex {
    const direction: Direction = 'leftToRight'
    return new Flex(fromShorthand(props, direction, extraProps))
  }

  static left(
    props: ShorthandProps = {},
    extraProps: Omit<Props, 'children' | 'direction'> = {},
  ): Flex {
    const direction: Direction = 'rightToLeft'
    return new Flex(fromShorthand(props, direction, extraProps))
  }

  constructor({children, direction, fill: shrink, gap, ...viewProps}: Props) {
    super(viewProps)
    this.#update({direction, fill: shrink, gap})
    this.#updateChildren(children)
  }

  update({children, ...props}: Props) {
    this.#update(props)
    this.#updateChildren(children)
    super.update(props)
  }

  #updateChildren(children: Props['children']) {
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
    } else {
      this.removeAllChildren()
    }
  }

  #update({direction, fill, gap}: Props) {
    this.#direction = direction ?? 'topToBottom'
    this.#fill = fill ?? true
    this.#gap = gap ?? 0
  }

  naturalSize(available: Size): Size {
    const size = Size.zero.mutableCopy()
    const remainingSize = available.mutableCopy()
    let hasFlex = false
    for (const child of this.children) {
      const childSize = child.naturalSize(remainingSize)
      if (!child.isVisible) {
        continue
      }

      if (this.isVertical) {
        if (size.height) {
          size.height += this.#gap
        }

        remainingSize.height = Math.max(
          0,
          remainingSize.height - childSize.height,
        )
        size.width = Math.max(size.width, childSize.width)
        size.height += childSize.height
      } else {
        if (size.width) {
          size.width += this.#gap
        }

        remainingSize.width = Math.max(0, remainingSize.width - childSize.width)
        size.width += childSize.width
        size.height = Math.max(size.height, childSize.height)
      }

      const flexSize = this.#sizes.get(child)
      if (flexSize && flexSize !== 'natural') {
        hasFlex = true
      }
    }

    if (hasFlex && this.#fill) {
      if (this.isVertical) {
        const height = Math.max(size.height, available.height)
        return new Size(size.width, height)
      } else {
        const width = Math.max(size.width, available.width)
        return new Size(width, size.height)
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

  get isVertical() {
    return (
      this.#direction === 'topToBottom' || this.#direction === 'bottomToTop'
    )
  }

  render(viewport: Viewport) {
    if (viewport.isEmpty) {
      return super.render(viewport)
    }

    const remainingSize = viewport.contentSize.mutableCopy()

    let flexTotal = 0
    let flexCount = 0
    // first pass, calculate all the naturalSizes and subtract them from the
    // contentSize - leftovers are divided to the flex views. naturalSizes might
    // as well be memoized along with the flex amounts
    const flexViews: [FlexSize, number, View][] = []
    for (const child of this.children) {
      if (!child.isVisible) {
        continue
      }

      if (flexViews.length) {
        if (this.isVertical) {
          remainingSize.height = Math.max(0, remainingSize.height - this.#gap)
        } else {
          remainingSize.width = Math.max(0, remainingSize.width - this.#gap)
        }
      }

      const flexSize = this.#sizes.get(child) ?? 'natural'
      if (flexSize === 'natural') {
        const childSize = child.naturalSize(remainingSize)

        if (this.isVertical) {
          flexViews.push(['natural', childSize.height, child])
          remainingSize.height -= childSize.height
        } else {
          flexViews.push(['natural', childSize.width, child])
          remainingSize.width -= childSize.width
        }

        remainingSize.height = Math.max(0, remainingSize.height)
        remainingSize.width = Math.max(0, remainingSize.width)
      } else {
        flexTotal += flexSize
        flexViews.push([flexSize, flexSize, child])
        flexCount += 1
      }
    }

    let origin: MutablePoint
    switch (this.#direction) {
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
    const totalRemainingSize = this.isVertical
      ? remainingSize.height
      : remainingSize.width
    let remainingDimension = totalRemainingSize
    let isFirst = true
    for (const [flexSize, amount, child] of flexViews) {
      const childSize = viewport.contentSize.mutableCopy()

      if (!isFirst) {
        remainingDimension -= this.#gap
      }

      if (flexSize === 'natural') {
        if (this.isVertical) {
          childSize.height = amount
        } else {
          childSize.width = amount
        }
      } else {
        // rounding errors can compound, so we track the error and add it to subsequent
        // views; the last view receives the amount left in remainingSize (0..1)
        let size = (totalRemainingSize / flexTotal) * amount + correctAmount
        correctAmount = size - ~~size
        remainingDimension -= ~~size

        // --flexCount === 0 checks for the last flex view
        if (--flexCount === 0) {
          size += remainingDimension
        }

        if (this.isVertical) {
          childSize.height = ~~size
        } else {
          childSize.width = ~~size
        }
      }

      if (this.#direction === 'rightToLeft') {
        origin.x -= childSize.width
      } else if (this.#direction === 'bottomToTop') {
        origin.y -= childSize.height
      }

      if (!isFirst) {
        if (this.#direction === 'leftToRight') {
          origin.x += this.#gap
        } else if (this.#direction === 'topToBottom') {
          origin.y += this.#gap
        }
      }

      viewport.clipped(new Rect(origin, childSize), inside => {
        child.render(inside)
      })

      if (!isFirst) {
        if (this.#direction === 'rightToLeft') {
          origin.x -= this.#gap
        } else if (this.#direction === 'bottomToTop') {
          origin.y -= this.#gap
        }
      }

      if (this.#direction === 'leftToRight') {
        origin.x += childSize.width
      } else if (this.#direction === 'topToBottom') {
        origin.y += childSize.height
      }

      isFirst = false
    }
  }
}
