import type {Viewport} from '../Viewport'
import type {MouseEvent} from '../events'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Container} from '../Container'
import {Text} from './Text'
import {Rect, Point, Size} from '../geometry'
import {Style} from '../Style'
import {
  isMousePressed,
  isMouseReleased,
  isMouseEnter,
  isMouseExit,
  isMouseClicked,
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
  style?: Partial<Style>
  hover?: Partial<Style>
  press?: Partial<Style>
  onClick?: () => void
  onHover?: (value: boolean) => void
  onPress?: (value: boolean) => void
}

type Props = StyleProps & (TextProps | LinesProps) & ViewProps

export class Button extends Container {
  /**
   * When `text:` is used to label the button, `defaultStyle` adds brackets to the
   * sides. If `content:` is used, no decorations are added.
   */
  defaultStyle: boolean
  onClick: StyleProps['onClick']
  onHover: StyleProps['onHover']
  onPress: StyleProps['onPress']
  style: Style
  hover: Style
  press: Style

  #textView?: Text
  #pressed = false
  #pressedOverride = false
  get isPressed() {
    return this.#pressedOverride || this.#pressed
  }
  set isPressed(value: boolean) {
    this.#pressedOverride = value
  }

  #hover = false
  #hoverOverride = false
  get isHover() {
    return this.#hoverOverride || this.#hover
  }
  set isHover(value: boolean) {
    this.#hoverOverride = value
  }

  get text() {
    return this.#textView?.text
  }
  set text(value: string | undefined) {
    if (this.#textView) {
      this.#textView.text = value ?? ''
    }
  }

  constructor({
    text,
    content,
    onClick,
    onHover,
    onPress,
    style,
    hover,
    press,
    ...viewProps
  }: Props) {
    super(viewProps)

    this.style = new Style({foreground: 'black', background: 'gray'}).merge(
      style,
    )
    this.hover = this.style.merge({background: 'white'}).merge(hover)
    this.press = this.style
      .merge({foreground: 'gray', background: 'green'})
      .merge(press)

    if (text !== undefined) {
      this.defaultStyle = true
      this.add(
        (this.#textView = new Text({
          text,
          alignment: 'center',
        })),
      )
    } else {
      this.defaultStyle = false
      this.add(content)
    }

    this.onClick = onClick
    this.onHover = onHover
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
      if (!this.isPressed) {
        this.onPress?.(true)
      }
      this.#pressed = true
    } else if (isMouseReleased(event)) {
      if (this.isPressed) {
        this.onPress?.(false)
      }
      this.#pressed = false

      if (isMouseClicked(event)) {
        this.onClick?.()
      }
    }

    if (isMouseEnter(event)) {
      if (!this.isHover) {
        this.onHover?.(true)
      }
      this.#hover = true
    } else if (isMouseExit(event)) {
      if (this.isHover) {
        this.onHover?.(false)
      }
      this.#hover = false
    }
  }

  render(viewport: Viewport) {
    viewport.registerMouse(this, ['mouse.button.left', 'mouse.move'])

    const style: Style = this.isPressed
      ? this.press
      : this.isHover
      ? this.hover
      : this.style

    viewport.usingPen(style, () => {
      const minX = viewport.visibleRect.minX()
      const maxX = viewport.visibleRect.maxX()
      const maxY = viewport.visibleRect.maxY()
      for (let y = viewport.visibleRect.minY(); y < maxY; ++y) {
        viewport.write(' '.repeat(maxX - minX), new Point(minX, y))
      }
    })

    const offset = viewport.contentSize.height === 1 ? 0 : 1
    viewport.clipped(
      new Rect(new Point(0, offset), viewport.contentSize.shrink(0, offset)),
      style,
      inside => {
        super.render(inside)
      },
    )
  }
}
