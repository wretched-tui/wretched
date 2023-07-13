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
  content?: undefined
}

interface LinesProps {
  text?: undefined
  content: View
}

interface StyleProps {
  foreground?: Color
  background?: Color
  hoverForeground?: Color
  hoverBackground?: Color
  pressForeground?: Color
  pressBackground?: Color
  onPress?: () => void
}

type Props = StyleProps & (TextProps | LinesProps)

export class Button extends Container {
  /**
   * When `text:` is used to label the button, `defaultStyle` adds brackets to the
   * sides. If `content:` is used, no decorations are added.
   */
  defaultStyle: boolean
  onPress: StyleProps['onPress']
  textView?: View
  foreground?: Color
  background?: Color
  hoverForeground?: Color
  hoverBackground: Color
  pressForeground?: Color
  pressBackground: Color

  #pressed = false
  #hover = false

  constructor({
    text,
    content,
    onPress,
    foreground,
    background,
    hoverBackground,
    hoverForeground,
    pressForeground,
    pressBackground,
  }: Props) {
    super()
    this.foreground = foreground ?? 'black'
    this.background = background ?? 'gray'
    this.hoverForeground = hoverForeground ?? this.foreground
    this.hoverBackground = hoverBackground ?? 'white'
    this.pressForeground = pressForeground ?? 'white'
    this.pressBackground = pressBackground ?? 'green'

    if (text !== undefined) {
      this.defaultStyle = true
      this.add(
        (this.textView = new Text({
          text,
          alignment: 'center',
        })),
      )
    } else {
      this.defaultStyle = false
      this.add((this.textView = content))
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
    viewport.claim(this, writer => {
      writer.registerMouse(this, 'mouse.button.left', 'mouse.move')

      const style: Style = this.#pressed
        ? new Style({
            foreground: this.pressForeground,
            background: this.pressBackground,
          })
        : this.#hover
        ? new Style({
            foreground: this.hoverForeground,
            background: this.hoverBackground,
          })
        : new Style({foreground: this.foreground, background: this.background})

      writer.usingPen(style, () => {
        const minX = viewport.visibleRect.minX()
        const maxX = viewport.visibleRect.maxX()
        const maxY = viewport.visibleRect.maxY()
        for (let y = viewport.visibleRect.minY(); y < maxY; ++y) {
          writer.write(' '.repeat(maxX - minX), new Point(minX, y))
        }
      })

      viewport.clipped(
        new Rect(new Point(1, 0), viewport.contentSize.shrink(2, 0)),
        style,
        inside => {
          super.render(inside)
        },
      )
    })
  }
}
