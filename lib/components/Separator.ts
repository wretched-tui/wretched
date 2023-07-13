import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Point, Size} from '../geometry'

type Direction = 'vertical' | 'horizontal'
type Border =
  | 'single'
  | 'bold'
  | 'dash'
  | 'dash2'
  | 'dash3'
  | 'dash4'
  | 'double'

interface Props {
  direction: Direction
  padding?: number
  border?: Border
}

export class Separator extends View {
  readonly direction: Direction
  readonly padding: number
  readonly border: Border

  constructor({direction, padding, border}: Props) {
    super()
    this.direction = direction
    this.padding = padding ?? 0
    this.border = border ?? 'single'
  }

  intrinsicSize(size: Size): Size {
    if (this.direction === 'vertical') {
      return new Size(1 + 2 * this.padding, size.height)
    } else {
      return new Size(size.width, 1 + 2 * this.padding)
    }
  }

  render(viewport: Viewport) {
    viewport.claim(this, writer => {
      if (this.direction === 'vertical') {
        const [char] = BORDERS[this.border]
        for (let y = 0; y < viewport.contentSize.height; ++y) {
          writer.write(char, new Point(this.padding, y))
        }
      } else {
        const [, char] = BORDERS[this.border]
        const pt = viewport.visibleRect.origin.mutableCopy()
        pt.y += this.padding
        writer.write(char.repeat(viewport.visibleRect.size.width), pt)
      }
    })
  }
}

const BORDERS: Record<Border, [string, string]> = {
  single: ['│', '─'],
  bold: ['┃', '━'],
  dash: ['╵', '╴'],
  dash2: ['╎', '╌'],
  dash3: ['┆', '┄'],
  dash4: ['┊', '┈'],
  double: ['║', '═'],
}
