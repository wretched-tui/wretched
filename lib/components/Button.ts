import type {Viewport} from '../Viewport'
import type {MouseEvent} from '../events'
import {View} from '../View'
import {Container} from '../Container'
import {Text} from './Text'
import {Rect, Point, Size} from '../geometry'
import type {Color} from '../ansi'
import {Style} from '../ansi'
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
  textView?: View
  fg: Color = 'black'
  bg: Color = 'white'
  hover: Color = 'gray'
  hoverFg?: Color

  constructor({text, child, onPress}: Props) {
    super()
    if (text !== undefined) {
      this.defaultStyle = true
      this.add((this.textView = new Text({text, alignment: 'center'})))
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
    viewport.registerMouse(this, 'mouse.button.left', 'mouse.move')

    const bg: Style = this.#pressed
      ? new Style({foreground: 'black', background: 'green'})
      : this.#hover
      ? new Style({foreground: 'black', background: 'white'})
      : new Style({foreground: 'black', background: 'gray'})

    viewport.usingPen(bg, () => {
      const minX = viewport.visibleRect.minX()
      const maxX = viewport.visibleRect.maxX()
      const maxY = viewport.visibleRect.maxY()
      for (let y = viewport.visibleRect.minY(); y < maxY; ++y) {
        viewport.write(' '.repeat(maxX - minX), new Point(minX, y))
      }
    })

    if (this.defaultStyle) {
      viewport.clipped(
        new Rect(new Point(1, 0), viewport.contentSize.shrink(2, 0)),
        inside => {
          inside.replacePen(bg)
          super.render(inside)
        },
      )
    } else {
      super.render(viewport)
    }
  }
}
