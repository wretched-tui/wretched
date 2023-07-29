import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {type Props as ViewProps, View} from '../View'
import {Container} from '../Container'
import {Text} from './Text'
import {Rect, Point, Size} from '../geometry'
import {
  type MouseEvent,
  isMousePressed,
  isMouseReleased,
  isMouseEnter,
  isMouseExit,
  isMouseClicked,
  HotKey,
  KeyEvent,
  styleTextForHotKey,
} from '../events'

type Border = 'default' | 'arrows' | 'large' | 'none'
type ButtonSize = 'compact' | 'large'
type BorderChars = [string, string, ButtonSize]

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
  onClick?: () => void
  hotKey?: HotKey
}

export type Props = StyleProps & (TextProps | LinesProps) & ViewProps

export class Button extends Container {
  #hotKey?: HotKey
  #onClick: StyleProps['onClick']
  #textView?: Text
  #border: Border
  #isPressed = false
  #isHover = false

  constructor({text, border, content, hotKey, onClick, ...viewProps}: Props) {
    super(viewProps)

    if (text !== undefined) {
      this.add(
        (this.#textView = new Text({
          text: hotKey ? styleTextForHotKey(text, hotKey) : text,
          alignment: 'center',
        })),
      )
    } else {
      if (content instanceof Text) {
        this.#textView = content
      }
      this.add(content)
    }

    this.#border = border ?? 'default'
    this.#hotKey = hotKey
    this.#onClick = onClick
  }

  get isHover() {
    return this.#isHover
  }

  get isPressed() {
    return this.#isPressed
  }

  get text() {
    return this.#textView?.text
  }
  set text(value: string | undefined) {
    if (this.#textView) {
      this.#textView.text = value ?? ''
      this.invalidateSize()
    }
  }

  #borderSize(): [number, number, number] {
    const [left, right, size] = BORDERS[this.#border]
    return [
      unicode.lineWidth(left),
      unicode.lineWidth(right),
      size === 'compact' ? 0 : 2,
    ]
  }

  naturalSize(availableSize: Size): Size {
    const [left, right, height] = this.#borderSize()
    return super.naturalSize(availableSize).grow(left + right, height)
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressed(event)) {
      this.#isPressed = true
    } else if (isMouseReleased(event)) {
      this.#isPressed = false

      if (isMouseClicked(event)) {
        this.#onClick?.()
      }
    }

    if (isMouseEnter(event)) {
      this.#isHover = true
    } else if (isMouseExit(event)) {
      this.#isHover = false
    }
  }

  receiveKey(_: KeyEvent) {
    this.#onClick?.()
  }

  render(viewport: Viewport) {
    viewport.registerMouse(['mouse.button.left', 'mouse.move'])

    if (this.#hotKey) {
      viewport.registerHotKey(this.#hotKey)
    }
    const textStyle = this.theme.ui({
      isPressed: this.#isPressed,
      isHover: this.#isHover,
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
      offset = new Point(
        offsetLeft,
        Math.round((viewport.contentSize.height - naturalSize.height) / 2),
      )

    const [left, right, size] = BORDERS[this.#border],
      leftX = size === 'compact' ? offset.x - leftWidth : 0,
      rightX =
        size === 'compact'
          ? offset.x + naturalSize.width
          : viewport.contentSize.width - rightWidth
    for (let y = 0; y < naturalSize.height; y++) {
      viewport.write(left, new Point(leftX, offset.y + y), textStyle)
      viewport.write(right, new Point(rightX, offset.y + y), textStyle)
    }
    viewport.clipped(new Rect(offset, naturalSize), textStyle, inside => {
      this.renderChildren(inside)
    })
  }
}

const BORDERS: Record<Border, BorderChars> = {
  default: ['[ ', ' ]', 'compact'],
  large: ['▌', '▐', 'large'],
  arrows: [' ', ' ', 'compact'],
  none: [' ', ' ', 'compact'],
}

// E0A0 
// E0B0 
