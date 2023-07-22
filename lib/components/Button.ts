import type {Viewport} from '../Viewport'
import type {MouseEvent} from '../events'
import type {Props as ViewProps} from '../View'
import type {ThemeType} from '../Theme'

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

type Border = 'default' | 'none'

interface TextProps {
  text: string
  content?: undefined
}

interface LinesProps {
  text?: undefined
  content: View
}

interface StyleProps {
  border?: Border
  type?: ThemeType
  style?: Partial<Style>
  hover?: Partial<Style>
  pressed?: Partial<Style>
  onClick?: () => void
  onHover?: (value: boolean) => void
  onPress?: (value: boolean) => void
}

type Props = StyleProps & (TextProps | LinesProps) & ViewProps

export class Button extends Container {
  onClick: StyleProps['onClick']
  onHover: StyleProps['onHover']
  onPress: StyleProps['onPress']

  #type: ThemeType
  #border: Border
  #style: Partial<Style> | undefined
  #hoverStyle: Partial<Style> | undefined
  #pressedStyle: Partial<Style> | undefined
  #textView?: Text

  #isPressed = false
  #isPressedOverride = false
  #isHover = false
  #isHoverOverride = false

  constructor({
    text,
    type,
    border,
    content,
    onClick,
    onHover,
    onPress,
    style,
    hover,
    pressed,
    ...viewProps
  }: Props) {
    super(viewProps)

    if (text !== undefined) {
      this.add(
        (this.#textView = new Text({
          text,
          alignment: 'center',
        })),
      )
    } else {
      this.add(content)
    }

    this.#type = type ?? 'plain'
    this.#border = border ?? 'default'
    this.#style = style
    this.#hoverStyle = hover
    this.#pressedStyle = pressed

    this.onClick = onClick
    this.onHover = onHover
    this.onPress = onPress
  }

  get isPressed() {
    return this.#isPressedOverride || this.#isPressed
  }
  set isPressed(value: boolean) {
    this.#isPressedOverride = value
  }

  get isHover() {
    return this.#isHoverOverride || this.#isHover
  }
  set isHover(value: boolean) {
    this.#isHoverOverride = value
  }

  get text() {
    return this.#textView?.text
  }
  set text(value: string | undefined) {
    if (this.#textView) {
      this.#textView.text = `< ${value} >` ?? ''
    }
  }

  intrinsicSize(availableSize: Size): Size {
    return super.intrinsicSize(availableSize).grow(2, 0)
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressed(event)) {
      if (!this.isPressed) {
        this.onPress?.(true)
      }
      this.#isPressed = true
    } else if (isMouseReleased(event)) {
      if (this.isPressed) {
        this.onPress?.(false)
      }
      this.#isPressed = false

      if (isMouseClicked(event)) {
        this.onClick?.()
      }
    }

    if (isMouseEnter(event)) {
      if (!this.isHover) {
        this.onHover?.(true)
      }
      this.#isHover = true
    } else if (isMouseExit(event)) {
      if (this.isHover) {
        this.onHover?.(false)
      }
      this.#isHover = false
    }
  }

  #currentStyle() {
    const text = this.theme[this.#type].text,
      bg = this.theme[this.#type].background,
      highlightBg = this.theme[this.#type].highlight

    let borderStyle: Style,
      style = new Style({
        foreground: text,
        background: bg,
      }).merge(this.#style)

    const hoverStyle = style
      .merge({background: highlightBg})
      .merge(this.#hoverStyle)

    if (this.isPressed) {
      style = style.merge({background: bg}).merge(this.#pressedStyle)
      borderStyle = style.merge({
        foreground: bg,
        background: bg,
      })
    } else if (this.isHover) {
      style = hoverStyle
      borderStyle = style.merge({
        foreground: hoverStyle.background,
        background: hoverStyle.background,
      })
    } else {
      borderStyle = style.merge({
        foreground: hoverStyle.background,
      })
    }

    return [style, borderStyle]
  }

  render(viewport: Viewport) {
    viewport.registerMouse(['mouse.button.left', 'mouse.move'])

    const [style, borderStyle] = this.#currentStyle()
    const [left, right] = this.#border === 'default' ? ['▌', '▐'] : [' ', ' ']

    viewport.usingPen(style, () => {
      const startX = Math.max(1, viewport.visibleRect.minX()),
        endX = Math.min(
          viewport.contentSize.width - 1,
          viewport.visibleRect.maxX(),
        ),
        minY = viewport.visibleRect.minY(),
        maxY = viewport.visibleRect.maxY()
      for (let y = minY; y < maxY; ++y) {
        viewport.usingPen(borderStyle, () => {
          viewport.write(left, new Point(0, y))
          viewport.write(right, new Point(viewport.contentSize.width - 1, y))
        })
        if (endX - startX > 2) {
          viewport.write(' '.repeat(endX - startX), new Point(startX, y))
        }
      }
    })

    const intrinsicSize = super.intrinsicSize(viewport.contentSize)
    const offset = ~~((viewport.contentSize.height - intrinsicSize.height) / 2)
    viewport.clipped(
      new Rect(new Point(1, offset), viewport.contentSize.shrink(1, offset)),
      style,
      inside => {
        super.render(inside)
      },
    )
  }
}
