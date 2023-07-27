import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import type {MouseEvent} from '../events'
import type {Props as ViewProps} from '../View'

import {View} from '../View'
import {Container} from '../Container'
import {Text} from './Text'
import {Rect, Point, Size} from '../geometry'
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
  isChecked: boolean
  onCheck?: (checked: boolean) => void
}

type Props = StyleProps & (TextProps | LinesProps) & ViewProps

export class Checkbox extends Container {
  onCheck: StyleProps['onCheck']

  #textView?: Text
  #isChecked: boolean
  #isPressed = false
  #isHover = false

  constructor({text, isChecked, content, onCheck, ...viewProps}: Props) {
    super(viewProps)

    if (text !== undefined) {
      this.add(
        (this.#textView = new Text({
          text,
          alignment: 'center',
        })),
      )
    } else {
      if (content instanceof Text) {
        this.#textView = content
      }
      this.add(content)
    }

    this.#isChecked = isChecked
    this.onCheck = onCheck
  }

  get isChecked() {
    return this.#isChecked
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

  #boxWidth(): number {
    const box = BOX.checked
    return unicode.lineWidth(box)
  }

  naturalSize(availableSize: Size): Size {
    return super.naturalSize(availableSize).grow(this.#boxWidth(), 0)
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressed(event)) {
      this.#isPressed = true
    } else if (isMouseReleased(event)) {
      this.#isPressed = false

      if (isMouseClicked(event)) {
        this.#isChecked = !this.#isChecked
        this.onCheck?.(this.#isChecked)
      }
    }

    if (isMouseEnter(event)) {
      this.#isHover = true
    } else if (isMouseExit(event)) {
      this.#isHover = false
    }
  }

  render(viewport: Viewport) {
    viewport.registerMouse(['mouse.button.left', 'mouse.move'])

    const uiStyle = this.theme.ui({
      isPressed: this.#isPressed,
      isHover: this.#isHover,
    })

    viewport.visibleRect.forEachPoint(pt => {
      viewport.write(' ', pt, uiStyle)
    })

    const boxWidth = this.#boxWidth()
    const naturalSize = super.naturalSize(
      viewport.contentSize.shrink(boxWidth, 0),
    )
    const offset = new Point(
      boxWidth,
      Math.round((viewport.contentSize.height - naturalSize.height) / 2),
    )

    const box = BOX[this.#isChecked ? 'checked' : 'unchecked']
    viewport.write(box, Point.zero, uiStyle)
    viewport.clipped(new Rect(offset, naturalSize), uiStyle, inside => {
      this.renderChildren(inside)
    })
  }
}

const BOX: Record<'unchecked' | 'checked', string> = {
  unchecked: '☐ ',
  checked: '☑ ',
}
