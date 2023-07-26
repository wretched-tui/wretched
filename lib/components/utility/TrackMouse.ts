import type {MouseEvent} from '../../events'
import type {Props as ViewProps} from '../../View'

import {Style} from '../../Style'
import {View} from '../../View'
import {Container} from '../../Container'
import {Viewport} from '../../Viewport'
import {Point, Size, Rect} from '../../geometry'

interface Props extends ViewProps {
  content: View
}

export class TrackMouse extends Container {
  #position: Point

  constructor({content, ...viewProps}: Props) {
    super(viewProps)
    this.#position = Point.zero
    this.add(content)
  }

  naturalSize(availableSize: Size) {
    return super.naturalSize(availableSize.shrink(1, 1)).grow(1, 1)
  }

  receiveMouse(event: MouseEvent) {
    this.#position = event.position
  }

  render(viewport: Viewport) {
    viewport.registerMouse('mouse.move')

    const maxX = viewport.contentSize.width
    const maxY = viewport.contentSize.height
    let borderStyle = new Style({foreground: 'white', background: 'default'})

    viewport.clipped(
      new Rect(new Point(1, 1), viewport.contentSize.shrink(1, 1)),
      inside => {
        this.renderChildren(inside)
      },
    )

    const highlight = new Style({inverse: true})
    viewport.usingPen(borderStyle, pen => {
      for (let x = 1; x < maxX; ++x) {
        pen.replacePen(x === this.#position.x ? highlight : Style.NONE)
        const char =
          x % 10 === 0
            ? ['0', '⠁', '⠉', '⠋', '⠛', '⠟', '⠿', '⡿', '⣿'][x / 10] ?? 'X'
            : `${x % 10}`
        viewport.write(char, new Point(x, 0))
      }
      for (let y = 0; y < maxY; ++y) {
        pen.replacePen(y === this.#position.y ? highlight : Style.NONE)
        const char =
          y % 10 === 0
            ? ['0', '⠁', '⠉', '⠋', '⠛', '⠟', '⠿', '⡿', '⣿'][y / 10] ?? 'X'
            : `${y % 10}`
        viewport.write(char, new Point(0, y))
      }
      pen.replacePen(Style.NONE)

      const pos = `${this.#position.x}, ${this.#position.y}`
      viewport.write(
        pos,
        new Point(
          viewport.contentSize.width - pos.length,
          viewport.contentSize.height - 1,
        ),
      )
    })
  }
}
