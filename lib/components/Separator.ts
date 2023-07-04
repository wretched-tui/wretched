import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Point, Size} from '../geometry'

type Direction = 'vertical' | 'horizontal'

interface Props {
  direction: Direction
  padding?: number
}

export class Separator extends View {
  readonly direction: Direction
  readonly padding: number

  constructor({direction, padding}: Props) {
    super()
    this.direction = direction
    this.padding = padding ?? 0
  }

  intrinsicSize(size: Size): Size {
    if (this.direction === 'vertical') {
      return new Size(1 + 2 * this.padding, size.height)
    } else {
      return new Size(size.width, 1 + 2 * this.padding)
    }
  }

  render(viewport: Viewport) {
    if (this.direction === 'vertical') {
      for (let y = 0; y < viewport.contentSize.height; ++y) {
        viewport.write('│', new Point(this.padding, y))
      }
    } else {
      const pt = viewport.visibleRect.origin.mutableCopy()
      pt.y += this.padding
      viewport.write('─'.repeat(viewport.visibleRect.size.width), pt)
    }
  }
}
