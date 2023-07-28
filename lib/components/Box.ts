import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size} from '../geometry'
import {Style} from '../Style'
import {type MouseEvent, isMouseEnter, isMouseExit} from '../events'

export type Border = 'single' | 'bold' | 'double' | 'round'

export type BorderChars =
  | [string, string, string, string, string, string]
  | [string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string]

export interface BorderSizes {
  top: number
  topRight: number
  left: number
  right: number
  bottom: number
  bottomRight: number
}

interface ChildrenProps {
  children: View[]
  content?: undefined
}
interface ContentProps {
  content?: View
  children?: undefined
}
interface StyleProps extends ViewProps {
  border?: Border | BorderChars
  highlight?: boolean
}
type Props = StyleProps & (ChildrenProps | ContentProps)

export class Box extends Container {
  #borderChars: BorderChars
  #borderSizes: BorderSizes
  #highlight: boolean
  #isHover = false

  constructor({content, children, border, highlight, ...viewProps}: Props) {
    super(viewProps)

    this.#highlight = highlight ?? false
    if (children) {
      this.addAll(children)
    } else if (content) {
      this.add(content)
    }

    ;[this.#borderChars, this.#borderSizes] = calculateBorder(
      border ?? 'single',
    )

    Object.defineProperty(this, 'border', {
      enumerable: true,
      get: () => {
        return border ?? 'single'
      },
      set: (value: Border | BorderChars) => {
        ;[this.#borderChars, this.#borderSizes] = calculateBorder(value)
      },
    })
  }

  declare border: Border | BorderChars

  naturalSize(size: Size): Size {
    const naturalSize = super.naturalSize(
      size.shrink(
        this.#borderSizes.left + this.#borderSizes.right,
        this.#borderSizes.top + this.#borderSizes.bottom,
      ),
    )
    return naturalSize.grow(
      this.#borderSizes.left + this.#borderSizes.right,
      this.#borderSizes.top + this.#borderSizes.bottom,
    )
  }

  receiveMouse(event: MouseEvent) {
    if (isMouseEnter(event)) {
      this.#isHover = true
    } else if (isMouseExit(event)) {
      this.#isHover = false
    }
  }

  render(viewport: Viewport) {
    if (this.#highlight) {
      viewport.registerMouse('mouse.move')
    }

    const [top, left, tl, tr, bl, br, bottom, right] = this.#borderChars

    const maxX = viewport.contentSize.width - this.#borderSizes.right
    const maxY = viewport.contentSize.height - this.#borderSizes.bottom
    let borderStyle = this.theme.text({isHover: this.#isHover})

    const innerStyle = new Style({background: borderStyle.background})
    for (let y = this.#borderSizes.top; y < maxY; ++y) {
      viewport.write(
        ' '.repeat(maxX - 1),
        new Point(this.#borderSizes.left, y),
        innerStyle,
      )
    }

    viewport.clipped(
      new Rect(
        new Point(this.#borderSizes.left, this.#borderSizes.top),
        viewport.contentSize.shrink(
          this.#borderSizes.left + this.#borderSizes.right,
          this.#borderSizes.top + this.#borderSizes.bottom,
        ),
      ),
      inside => {
        this.renderChildren(inside)
      },
    )

    viewport.usingPen(borderStyle, () => {
      viewport.write(
        tl + top.repeat(maxX - this.#borderSizes.topRight) + tr,
        new Point(0, 0),
      )
      viewport.write(
        bl + (bottom ?? top).repeat(maxX - this.#borderSizes.bottomRight) + br,
        new Point(0, maxY),
      )
      for (let y = this.#borderSizes.top; y < maxY; ++y) {
        viewport.write(left, new Point(0, y))
        viewport.write(right ?? left, new Point(maxX, y))
      }
    })
  }
}

function calculateBorder(
  border: Border | BorderChars,
): [BorderChars, BorderSizes] {
  let chars: BorderChars, sizes: BorderSizes
  if (typeof border === 'string') {
    chars = BORDERS[border]
    sizes = {
      top: 1,
      topRight: 1,
      left: 1,
      right: 1,
      bottom: 1,
      bottomRight: 1,
    }
  } else {
    chars = border
    const top = borderSize(chars[0])
    const left = borderSize(chars[1])
    // topLeft: 2
    const topRight = borderSize(chars[3])
    // bottomLeft: 4
    const bottomRight = borderSize(chars[5])
    const bottom = chars[6] !== undefined ? borderSize(chars[6]) : top
    const right = chars[7] !== undefined ? borderSize(chars[7]) : left
    sizes = {
      left: left.width,
      right: right.width,
      top: top.height,
      topRight: topRight.width,
      bottom: bottom.height,
      bottomRight: bottomRight.width,
    }
  }
  return [chars, sizes]
}

function borderSize(str: string) {
  if (str === '') {
    return {width: 0, height: 0}
  }
  return unicode.stringSize(str)
}

const BORDERS: Record<Border, BorderChars> = {
  single: ['─', '│', '┌', '┐', '└', '┘'],
  bold: ['━', '┃', '┏', '┓', '┗', '┛'],
  double: ['═', '║', '╔', '╗', '╚', '╝'],
  round: ['─', '│', '╭', '╮', '╰', '╯'],
}
