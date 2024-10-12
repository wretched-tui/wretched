import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {type Props as ContainerProps, Container} from '../Container'
import {Text} from './Text'
import {Rect, Point, Size} from '../geometry'
import {
  type MouseEvent,
  isMousePressInside,
  isMousePressOutside,
  isMouseEnter,
  isMouseExit,
  isMouseClicked,
  HotKey,
  KeyEvent,
  styleTextForHotKey,
} from '../events'
import {Theme} from '../Theme'
import {childTheme} from '../UI'

type Border = 'default' | 'arrows' | 'none'
type BorderChars = [string, string]

export interface Props extends ContainerProps {
  text?: string
  border?: Border
  onClick?: () => void
  hotKey?: HotKey
}

export class Button extends Container {
  #hotKey?: HotKey
  #onClick?: Props['onClick']
  #textView?: Text = undefined
  #border: Border = 'default'
  #isPressed = false
  #isHover = false

  constructor(props: Props) {
    super(props)

    if (this.#textView === undefined) {
      this.#textView = new Text({alignment: 'center'})
      this.add(this.#textView)
    }

    this.#update(props)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  childTheme() {
    return childTheme(super.childTheme(), this.#isPressed, this.#isHover)
  }

  #update({text, border, hotKey, onClick}: Props) {
    if (this.#textView && text !== undefined) {
      const styledText = hotKey ? styleTextForHotKey(text, hotKey) : text
      this.#textView.text = styledText
    }

    this.#border = border ?? 'default'
    this.#hotKey = hotKey
    this.#onClick = onClick
  }

  naturalSize(availableSize: Size): Size {
    const [left, right] = this.#borderSize()
    return super.naturalSize(availableSize).grow(left + right, 0)
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

  #borderSize(): [number, number] {
    const [left, right] = BORDERS[this.#border]
    return [unicode.lineWidth(left), unicode.lineWidth(right)]
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressInside(event)) {
      this.#isPressed = true
    } else if (isMousePressOutside(event)) {
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
    const topsStyle = this.theme.ui({
      isPressed: this.#isPressed,
      isHover: this.#isHover,
      isOrnament: true,
    })

    viewport.visibleRect.forEachPoint(pt => {
      if (pt.y === 0 && viewport.contentSize.height > 2) {
        viewport.write('▔', pt, topsStyle)
      } else if (
        pt.y === viewport.contentSize.height - 1 &&
        viewport.contentSize.height > 2
      ) {
        viewport.write('▁', pt, topsStyle)
      } else {
        viewport.write(' ', pt, textStyle)
      }
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

    const [left, right] = BORDERS[this.#border],
      leftX = offset.x - leftWidth,
      rightX = offset.x + naturalSize.width

    for (let y = 0; y < naturalSize.height; y++) {
      viewport.write(left, new Point(leftX, offset.y + y), textStyle)
      viewport.write(right, new Point(rightX, offset.y + y), textStyle)
    }
    viewport.clipped(new Rect(offset, naturalSize), inside => {
      super.render(inside)
    })
  }
}

const BORDERS: Record<Border, BorderChars> = {
  default: ['[ ', ' ]'],
  arrows: [' ', ' '],
  none: [' ', ' '],
}

// E0A0 
// E0B0 
