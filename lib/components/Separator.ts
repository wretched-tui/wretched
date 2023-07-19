import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import type {Style} from '../Style'
import {Point, Size} from '../geometry'

type Direction = 'vertical' | 'horizontal'
type Border =
  | 'single'
  | 'leading'
  | 'trailing'
  | 'bold'
  | 'dash'
  | 'dash2'
  | 'dash3'
  | 'dash4'
  | 'double'

interface Props extends ViewProps {
  direction: Direction
  padding?: number
  border?: Border
  style?: Style
}

export class Separator extends View {
  #direction: Direction
  #padding: number
  #border: Border
  #style: Style | undefined

  constructor({direction, padding, border, style, ...viewProps}: Props) {
    super(viewProps)
    this.#direction = direction
    this.#padding = padding ?? 0
    this.#border = border ?? 'single'
    this.#style = style
  }

  intrinsicSize(size: Size): Size {
    if (this.#direction === 'vertical') {
      return new Size(1 + 2 * this.#padding, size.height)
    } else {
      return new Size(size.width, 1 + 2 * this.#padding)
    }
  }

  render(viewport: Viewport) {
    viewport.usingPen(this.#style, () => {
      if (this.#direction === 'vertical') {
        const [char] = BORDERS[this.#border],
          minY = viewport.visibleRect.minY(),
          maxY = viewport.visibleRect.maxY()
        for (let y = minY; y < maxY; ++y) {
          viewport.write(char, new Point(this.#padding, y))
        }
      } else {
        const [, char] = BORDERS[this.#border]
        const pt = viewport.visibleRect.origin.offset(0, this.#padding)
        viewport.write(char.repeat(viewport.visibleRect.size.width), pt)
      }
    })
  }
}

const BORDERS: Record<Border, [string, string]> = {
  single: ['│', '─'],
  leading: ['▏', '▔'],
  trailing: ['▕', '▁'],
  bold: ['┃', '━'],
  dash: ['╵', '╴'],
  dash2: ['╎', '╌'],
  dash3: ['┆', '┄'],
  dash4: ['┊', '┈'],
  double: ['║', '═'],
}
