import type {Viewport} from '../Viewport'

import type {Props as ButtonProps} from './Button'
import {Button} from './Button'
import {Rect, Point, Size} from '../geometry'

type Border = 'default' | 'none'
type BorderChars = [string, string]

type Props = ButtonProps & {
  border?: Border
}

export class LargeButton extends Button {
  #border: Border

  constructor({border, ...buttonProps}: Props) {
    super(buttonProps)
    this.#border = border ?? 'default'
  }

  naturalSize(availableSize: Size): Size {
    return super.naturalSize(availableSize).grow(2, 2)
  }

  render(viewport: Viewport) {
    viewport.registerMouse(['mouse.button.left', 'mouse.move'])

    const textStyle = this.theme.ui({
      isPressed: this.isPressed,
      isHover: this.isHover,
    })
    const borderStyle = this.theme.ui({
      isPressed: this.isPressed,
      isHover: this.isHover,
      isOrnament: true,
    })

    const [left, right] = BORDERS[this.#border]
    const startX = Math.max(1, viewport.visibleRect.minX()),
      endX = Math.min(
        viewport.contentSize.width - 1,
        viewport.visibleRect.maxX(),
      ),
      minY = viewport.visibleRect.minY(),
      maxY = viewport.visibleRect.maxY()
    for (let y = minY; y < maxY; ++y) {
      viewport.write(left, new Point(0, y), borderStyle)
      viewport.write(
        right,
        new Point(viewport.contentSize.width - 1, y),
        borderStyle,
      )

      if (endX - startX > 2) {
        viewport.write(
          ' '.repeat(endX - startX),
          new Point(startX, y),
          textStyle,
        )
      }
    }

    const naturalSize = super.naturalSize(viewport.contentSize)
    const offset = ~~((viewport.contentSize.height - naturalSize.height) / 2)
    viewport.clipped(
      new Rect(new Point(1, offset), viewport.contentSize.shrink(1, offset)),
      textStyle,
      inside => {
        this.renderChildren(inside)
      },
    )
  }
}

const BORDERS: Record<Border, BorderChars> = {
  default: ['▌', '▐'],
  none: [' ', ' '],
}
