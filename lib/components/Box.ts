import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size} from '../geometry'
import {Style} from '../ansi'

type Border = 'cool' | 'single' | 'bold' | 'double' | 'round'

interface Props {
  content: View
  border?: Border
}

export class Box extends Container {
  readonly border: Border

  constructor({content, border}: Props) {
    super()
    this.border = border ?? 'single'
    this.add(content)
  }

  intrinsicSize(size: Size): Size {
    const intrinsicSize = super.intrinsicSize(size.shrink(2, 2))
    return intrinsicSize.grow(2, 2)
  }

  render(viewport: Viewport) {
    const maxX = viewport.contentSize.width - 1
    const maxY = viewport.contentSize.height - 1
    const borderStyle =
      this.border === 'cool'
        ? new Style({foreground: [98, 196, 255], background: [34, 34, 37]})
        : new Style({foreground: 'white', background: 'default'})
    const innerStyle =
      this.border === 'cool' ? borderStyle.invert() : Style.NONE

    viewport.claim(this, innerStyle, writer => {
      for (let y = 1; y < maxY; ++y) {
        writer.write(' '.repeat(maxX - 1), new Point(1, y))
      }
    })

    viewport.clipped(
      new Rect(new Point(1, 1), viewport.contentSize.shrink(2, 2)),
      inside => {
        super.render(inside)
      },
    )

    viewport.claim(this, borderStyle, writer => {
      const [top, left, tl, tr, bl, br, bottom, right] = BORDERS[this.border]
      writer.write(top.repeat(maxX - 1), new Point(1, 0))
      writer.write((bottom ?? top).repeat(maxX - 1), new Point(1, maxY))
      for (let y = 1; y < maxY; ++y) {
        writer.write(left, new Point(0, y))
        writer.write(right ?? left, new Point(maxX, y))
      }
      writer.write(tl, Point.zero)
      writer.write(tr, new Point(maxX, 0))
      writer.write(bl, new Point(0, maxY))
      writer.write(br, new Point(maxX, maxY))
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
