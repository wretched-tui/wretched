import {unicode} from '../sys'

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

export type Props = StyleProps & (TextProps | LinesProps) & ViewProps

export class Button extends Container {
  onClick: StyleProps['onClick']
  onHover: StyleProps['onHover']
  onPress: StyleProps['onPress']

  #textView?: Text
  #border: Border

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
      this.invalidateSize()
    }
  }

  #borderSize(): [number, number] {
    const [left, right] = BORDERS[this.#border]
    return [unicode.lineWidth(left), unicode.lineWidth(right)]
  }

  naturalSize(availableSize: Size): Size {
    const [left, right] = this.#borderSize()
    return super.naturalSize(availableSize).grow(left + right, 0)
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

    const textStyle = this.theme.ui({
      isPressed: this.isPressed,
      isHover: this.isHover,
    })

    viewport.visibleRect.forEachPoint(pt => {
      viewport.write(' ', pt, textStyle)
    })

    const [leftWidth, rightWidth] = this.#borderSize()
    const naturalSize = super.naturalSize(
      viewport.contentSize.shrink(leftWidth + rightWidth, 0),
    )
    const offsetLeft = Math.round(
        (viewport.contentSize.width - naturalSize.width) / 2,
      ),
      offsetRight = Math.floor(
        (viewport.contentSize.width - naturalSize.width) / 2,
      )
    const offset = new Point(
      offsetLeft,
      Math.round((viewport.contentSize.height - naturalSize.height) / 2),
    )

    const [left, right] = BORDERS[this.#border]
    for (let y = 0; y < naturalSize.height; y++) {
      viewport.write(
        left,
        new Point(offset.x - leftWidth, offset.y + y),
        textStyle,
      )
      viewport.write(
        right,
        new Point(offset.x + naturalSize.width, offset.y + y),
        textStyle,
      )
    }
    viewport.clipped(new Rect(offset, naturalSize), textStyle, inside => {
      this.renderChildren(inside)
    })
  }
}

const BORDERS: Record<Border, BorderChars> = {
  default: ['[ ', ' ]'],
  arrows: ['⟨ ', ' ⟩'],
  none: [' ', ' '],
}
