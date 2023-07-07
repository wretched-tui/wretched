import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Container} from '../Container'
import {Rect, Point, Size} from '../geometry'
import {isMouseEnter, isMouseExit} from '../events'
import {style} from '../ansi'

type Border = 'single' | 'bold' | 'double' | 'round'

interface Props {
  child: View
  border?: Border
}

export class Box extends Container {
  readonly border: Border

  constructor({child, border}: Props) {
    super()
    this.border = border ?? 'single'
    this.add(child)
  }

  intrinsicSize(size: Size): Size {
    const intrinsicSize = super.intrinsicSize(size.shrink(2, 2))
    return intrinsicSize.grow(2, 2)
  }

  render(viewport: Viewport) {
    const maxX = viewport.contentSize.width - 1
    const maxY = viewport.contentSize.height - 1
    for (let y = 1; y < maxY; ++y) {
      viewport.write(' '.repeat(maxX - 1), new Point(1, y))
    }

    const inside = viewport.clipped(
      new Rect(new Point(1, 1), viewport.contentSize.shrink(2, 2)),
    )
    super.render(inside)

    const [sides, tops, tl, tr, bl, br] = BORDERS[this.border]
    viewport.write(sides.repeat(maxX - 1), new Point(1, 0))
    viewport.write(sides.repeat(maxX - 1), new Point(1, maxY))
    for (let y = 1; y < maxY; ++y) {
      viewport.write(tops, new Point(0, y))
      viewport.write(tops, new Point(maxX, y))
    }
    viewport.write(tl, Point.zero)
    viewport.write(tr, new Point(maxX, 0))
    viewport.write(bl, new Point(0, maxY))
    viewport.write(br, new Point(maxX, maxY))
  }
}

type Chars = [string, string, string, string, string, string]
const BORDERS: Record<Border, Chars> = {
  single: ['─', '│', '┌', '┐', '└', '┘'],
  bold: ['━', '┃', '┏', '┓', '┗', '┛'],
  double: ['═', '║', '╔', '╗', '╚', '╝'],
  round: ['─', '│', '╭', '╮', '╰', '╯'],
}
