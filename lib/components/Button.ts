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

type Border = 'default' | 'arrows' | 'none'
type BorderChars = [string, string]

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

  #border: Border
  #textView?: Text

  #isPressed = false
  #isPressedOverride = false
  #isHover = false
  #isHoverOverride = false

  constructor({
    text,
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

    this.#border = border ?? 'default'

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

  render(viewport: Viewport) {
    viewport.registerMouse(['mouse.button.left', 'mouse.move'])

    const textStyle = this.theme.default({
      isPressed: this.isPressed,
      isHover: this.isHover,
    })
    const [left, right] = BORDERS[this.#border]

    viewport.usingPen(textStyle, () => {
      const startX = Math.max(1, viewport.visibleRect.minX()),
        endX = Math.min(
          viewport.contentSize.width - 1,
          viewport.visibleRect.maxX(),
        ),
        minY = viewport.visibleRect.minY(),
        maxY = viewport.visibleRect.maxY()
      for (let y = minY; y < maxY; ++y) {
        viewport.usingPen(textStyle, () => {
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
      textStyle,
      inside => {
        super.render(inside)
      },
    )
  }
}

const BORDERS: Record<Border, BorderChars> = {
  default: ['▌', '▐'],
  arrows: ['⟨', '⟩'],
  none: [' ', ' '],
}
