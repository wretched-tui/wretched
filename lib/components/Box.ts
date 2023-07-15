import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size} from '../geometry'
import {Color} from '../ansi'
import {Style} from '../Style'

type Border = 'cool' | 'single' | 'bold' | 'double' | 'round'

interface Props extends ViewProps {
  content: View
  border?: Border
  highlight?: Color
}

export class Box extends Container {
  readonly border: Border
  readonly highlight?: Color

  constructor({content, border, highlight, ...viewProps}: Props) {
    super(viewProps)
    this.border = border ?? 'single'
    this.highlight = highlight
    this.add(content)
  }

  intrinsicSize(size: Size): Size {
    const intrinsicSize = super.intrinsicSize(size.shrink(2, 2))
    return intrinsicSize.grow(2, 2)
  }

  render(viewport: Viewport) {
    if (this.highlight) {
      viewport.registerMouse(this, 'mouse.move')
    }

    const maxX = viewport.contentSize.width - 1
    const maxY = viewport.contentSize.height - 1
    const borderStyle =
      this.border === 'cool'
        ? new Style({foreground: [98, 196, 255], background: [34, 34, 37]})
        : new Style({foreground: 'white', background: 'default'})
    const innerStyle =
      this.border === 'cool' ? borderStyle.invert() : Style.NONE

    viewport.usingPen(innerStyle, () => {
      for (let y = 1; y < maxY; ++y) {
        viewport.write(' '.repeat(maxX - 1), new Point(1, y))
      }
    })

    viewport.clipped(
      new Rect(new Point(1, 1), viewport.contentSize.shrink(2, 2)),
      inside => {
        super.render(inside)
      },
    )

    viewport.usingPen(borderStyle, () => {
      const [top, left, tl, tr, bl, br, bottom, right] = BORDERS[this.border]
      viewport.write(top.repeat(maxX - 1), new Point(1, 0))
      viewport.write((bottom ?? top).repeat(maxX - 1), new Point(1, maxY))
      for (let y = 1; y < maxY; ++y) {
        viewport.write(left, new Point(0, y))
        viewport.write(right ?? left, new Point(maxX, y))
      }
      viewport.write(tl, Point.zero)
      viewport.write(tr, new Point(maxX, 0))
      viewport.write(bl, new Point(0, maxY))
      viewport.write(br, new Point(maxX, maxY))
    })
  }
}

type Chars =
  | [string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string]
const BORDERS: Record<Border, Chars> = {
  cool: ['▄', ' ', '▗', '▖', '▝', '▘', '▀', ' '],
  single: ['─', '│', '┌', '┐', '└', '┘'],
  bold: ['━', '┃', '┏', '┓', '┗', '┛'],
  double: ['═', '║', '╔', '╗', '╚', '╝'],
  round: ['─', '│', '╭', '╮', '╰', '╯'],
}
