import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {type Props as ContainerProps, Container} from '../Container'
import {Rect, Point, Size} from '../geometry'
import {Style} from '../Style'
import {type MouseEvent, isMouseEnter, isMouseExit} from '../events'

export type Border =
  | 'single'
  | 'bold'
  | 'double'
  | 'rounded'
  | 'dotted'
  | 'popout'

export type BorderChars =
  | [string, string, string, string, string, string]
  | [string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string]

export interface BorderSizes {
  maxTop: number
  maxRight: number
  maxBottom: number
  maxLeft: number
  top: number
  topLeft: number
  topRight: number
  left: number
  right: number
  bottom: number
  bottomLeft: number
  bottomRight: number
}

interface Props extends ContainerProps {
  border?: Border | BorderChars
  highlight?: boolean
}

export class Box extends Container {
  #border: Border | BorderChars = 'single'
  #borderChars: BorderChars = BORDERS.single
  #borderSizes: BorderSizes = BORDER_SIZE_ZERO
  #highlight: boolean = false
  #isHover = false

  declare border: Border | BorderChars

  constructor(props: Props) {
    super(props)

    this.#update(props)

    Object.defineProperty(this, 'border', {
      enumerable: true,
      get: () => {
        return this.#border
      },
      set: (value: Border | BorderChars) => {
        this.#border = value
        ;[this.#borderChars, this.#borderSizes] = calculateBorder(value)
      },
    })
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({highlight, border}: Props) {
    this.#highlight = highlight ?? false
    ;[this.#borderChars, this.#borderSizes] = calculateBorder(
      border ?? 'single',
    )
  }

  naturalSize(size: Size): Size {
    const naturalSize = super.naturalSize(
      size.shrink(
        this.#borderSizes.maxLeft + this.#borderSizes.maxRight,
        this.#borderSizes.maxTop + this.#borderSizes.maxBottom,
      ),
    )

    return naturalSize.grow(
      this.#borderSizes.maxLeft + this.#borderSizes.maxRight,
      this.#borderSizes.maxTop + this.#borderSizes.maxBottom,
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

    const maxX = viewport.contentSize.width
    const maxY = viewport.contentSize.height - this.#borderSizes.bottom
    let borderStyle = this.theme.text({isHover: this.#isHover})

    const innerStyle = new Style({background: borderStyle.background})
    for (let y = this.#borderSizes.top; y < maxY; ++y) {
      viewport.write(
        ' '.repeat(
          Math.max(0, maxX - this.#borderSizes.left - this.#borderSizes.right),
        ),
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
        super.render(inside)
      },
    )

    viewport.usingPen(borderStyle, () => {
      const [tlLines, topLines, trLines] = [
        tl.split('\n'),
        top.split('\n'),
        tr.split('\n'),
      ]
      for (let line = 0; line < this.#borderSizes.maxTop; ++line) {
        const [lineTL, lineTop, lineTR] = [
          tlLines[line] ?? '',
          topLines[line] ?? '',
          trLines[line] ?? '',
        ]
        viewport.write(
          lineTL +
            lineTop.repeat(
              Math.max(
                0,
                viewport.contentSize.width -
                  this.#borderSizes.topRight -
                  this.#borderSizes.topLeft,
              ),
            ) +
            lineTR,
          new Point(0, line),
        )
      }
      viewport.write(
        bl +
          (bottom ?? top).repeat(
            Math.max(
              0,
              viewport.contentSize.width -
                this.#borderSizes.bottomLeft -
                this.#borderSizes.bottomRight,
            ),
          ) +
          br,
        new Point(0, maxY),
      )
      for (let y = this.#borderSizes.top; y < maxY; ++y) {
        viewport.write(left, new Point(0, y))
        viewport.write(
          right ?? left,
          new Point(maxX - this.#borderSizes.right, y),
        )
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
  } else {
    chars = border
  }

  const top = borderSize(chars[0])
  const left = borderSize(chars[1])
  const topLeft = borderSize(chars[2])
  const topRight = borderSize(chars[3])
  const bottomLeft = borderSize(chars[4])
  const bottomRight = borderSize(chars[5])
  const bottom = chars[6] !== undefined ? borderSize(chars[6]) : top
  const right = chars[7] !== undefined ? borderSize(chars[7]) : left
  sizes = {
    maxLeft: Math.max(topLeft.width, left.width, bottomLeft.width),
    maxRight: Math.max(topRight.width, right.width, bottomRight.width),
    maxTop: Math.max(top.height, topLeft.height, topRight.height),
    maxBottom: Math.max(bottom.height, bottomLeft.height, bottomRight.height),
    top: top.height,
    bottom: bottom.height,
    left: left.width,
    right: right.width,
    topLeft: topLeft.width,
    topRight: topRight.width,
    bottomLeft: bottomLeft.width,
    bottomRight: bottomRight.width,
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
  rounded: ['─', '│', '╭', '╮', '╰', '╯'],
  dotted: ['⠒', '⡇', '⡖', '⢲', '⠧', '⠼', '⠤', '⢸'],
  popout: [' \n─', '│', ' \n┌', ' /\\   \n/  \\─┐', '└', '┘', '─', '│'],
}

const BORDER_SIZE_ZERO: BorderSizes = {
  maxTop: 0,
  maxRight: 0,
  maxBottom: 0,
  maxLeft: 0,
  top: 0,
  topLeft: 0,
  topRight: 0,
  left: 0,
  right: 0,
  bottom: 0,
  bottomLeft: 0,
  bottomRight: 0,
}
