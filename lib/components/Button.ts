import type {Viewport} from '../Viewport'
import type {MouseEvent} from '../events'
import {View} from '../View'
import {Container} from '../Container'
import {Text} from './Text'
import {Rect, Point, Size} from '../geometry'
import {styled, style} from '../ansi'
import {
  isMousePressed,
  isMouseReleased,
  isMouseEnter,
  isMouseExit,
} from '../events'

interface TextProps {
  text: string
  child?: undefined
}

interface LinesProps {
  text?: undefined
  child: View
}

interface StyleProps {
  onPress?: () => void
}

type Props = StyleProps & (TextProps | LinesProps)

export class Button extends Container {
  /**
   * When `text:` is used to label the button, `defaultStyle` adds brackets to the
   * sides. If `child:` is used, no decorations are added.
   */
  defaultStyle: boolean
  onPress: StyleProps['onPress']
  #pressed = false
  #hover = false

  constructor({text, child, onPress}: Props) {
    super()
    if (text !== undefined) {
      this.defaultStyle = true
      this.add(new Text({text, alignment: 'center'}))
    } else {
      this.defaultStyle = false
      this.add(child)
    }

    this.onPress = onPress
  }

  intrinsicSize(availableSize: Size): Size {
    const size = super.intrinsicSize(availableSize).mutableCopy()
    if (this.defaultStyle) {
      return size.grow(2, 0)
    } else {
      return size
    }
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressed(event)) {
      this.#pressed = true
    } else if (isMouseReleased(event)) {
      this.#pressed = false
      if (event.name === 'mouse.button.up') {
        this.onPress?.()
      }
    }

    if (isMouseEnter(event)) {
      this.#hover = true
    } else if (isMouseExit(event)) {
      this.#hover = false
    }
  }

  render(viewport: Viewport) {
    viewport.assignMouse(this, 'mouse.button.left', 'mouse.move')

    const bg = this.#pressed
      ? 'black fg;green bg'
      : this.#hover
      ? 'black fg;white bg'
      : 'black fg;gray bg'
    const minX = viewport.visibleRect.minX()
    const maxX = viewport.visibleRect.maxX()
    const maxY = viewport.visibleRect.maxY()
    for (let y = viewport.visibleRect.minY(); y < maxY; ++y) {
      viewport.write(styled(' '.repeat(maxX - minX), bg), new Point(minX, y))
    }

    if (this.defaultStyle) {
      const inside = viewport
        .clipped(new Rect(new Point(1, 0), viewport.contentSize.shrink(2, 0)))
        .setPen(bg)
      super.render(inside)
    } else {
      super.render(viewport)
    }
  }
}
