import type {Viewport} from '../Viewport'
import {View} from '../View'
import {Rect, Point, Size} from '../geometry'

interface Props {
  child: View
}

export class Box extends View {
  constructor({child}: Props) {
    super()
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

    const inside = viewport.clipped(new Rect(new Point(1, 1), viewport.contentSize.shrink(2, 2)))
    super.render(inside)

    viewport.write('─'.repeat(maxX - 1), new Point(1, 0))
    viewport.write('─'.repeat(maxX - 1), new Point(1, maxY))
    for (let y = 1; y < maxY; ++y) {
      viewport.write('│', new Point(0, y))
      viewport.write('│', new Point(maxX, y))
    }
    viewport.write('┌', Point.zero)
    viewport.write('┐', new Point(maxX, 0))
    viewport.write('└', new Point(0, maxY))
    viewport.write('┘', new Point(maxX, maxY))
  }
}
