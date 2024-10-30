import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {type View} from '../View'
import {type Props as ContainerProps, Container} from '../Container'
import {Text} from './Text'
import {Rect, Point, Size} from '../geometry'
import {
  type HotKey,
  type MouseEvent,
  isMousePressStart,
  isMousePressExit,
  isMouseEnter,
  isMouseExit,
  isMouseClicked,
  styleTextForHotKey,
} from '../events'
import {childTheme} from '../UI'

interface StyleProps {
  text?: string
  isChecked: boolean
  onChange?: (isChecked: boolean) => void
  hotKey?: HotKey
}

type Props = StyleProps & ContainerProps

export class Checkbox extends Container {
  isChecked: boolean = false
  #hotKey?: HotKey
  #onChange: StyleProps['onChange']
  #textView?: Text
  #contentView?: View
  #isPressed = false
  #isHover = false

  constructor(props: Props) {
    super(props)

    if (this.#textView === undefined) {
      this.add(new Text({alignment: 'center'}))
    }

    this.#update(props)
  }

  childTheme(view: View) {
    return childTheme(super.childTheme(view), this.#isPressed, this.#isHover)
  }

  add(child: View, at?: number) {
    if (this.#textView === undefined && child instanceof Text) {
      this.#textView = child
    }

    super.add(child, at)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({text, hotKey, isChecked, onChange}: Props) {
    if (this.#textView && text !== undefined) {
      const styledText = hotKey ? styleTextForHotKey(text, hotKey) : text
      this.#textView.text = styledText
    }

    this.isChecked = isChecked
    this.#hotKey = hotKey
    this.#onChange = onChange
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
    const box = BOX.checkbox.unchecked
    return unicode.lineWidth(box)
  }

  naturalSize(available: Size): Size {
    return super.naturalSize(available).grow(this.#boxWidth(), 0)
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressStart(event)) {
      this.#isPressed = true
    } else if (isMousePressExit(event)) {
      this.#isPressed = false

      if (isMouseClicked(event)) {
        this.isChecked = !this.isChecked
        this.#onChange?.(this.isChecked)
      }
    }

    if (isMouseEnter(event)) {
      this.#isHover = true
    } else if (isMouseExit(event)) {
      this.#isHover = false
    }
  }

  render(viewport: Viewport) {
    if (viewport.isEmpty) {
      return super.render(viewport)
    }

    viewport.registerMouse(['mouse.button.left', 'mouse.move'])

    const uiStyle = this.theme.ui({
      isPressed: this.#isPressed,
      isHover: this.#isHover,
    })

    viewport.paint(uiStyle)

    const boxWidth = this.#boxWidth()
    const naturalSize = super.naturalSize(
      viewport.contentSize.shrink(boxWidth, 0),
    )
    const offset = new Point(
      boxWidth,
      Math.round((viewport.contentSize.height - naturalSize.height) / 2),
    )

    const box = this.boxChars()[this.isChecked ? 'checked' : 'unchecked']
    viewport.write(box, Point.zero, uiStyle)
    viewport.clipped(new Rect(offset, naturalSize), uiStyle, inside => {
      super.render(inside)
    })
  }

  boxChars(): Record<'unchecked' | 'checked', string> {
    return BOX.checkbox
  }
}

export class Radio extends Checkbox {
  boxChars(): Record<'unchecked' | 'checked', string> {
    return BOX.radio
  }
}

const BOX: Record<
  'checkbox' | 'radio',
  Record<'unchecked' | 'checked', string>
> = {
  checkbox: {
    unchecked: '☐ ',
    checked: '☑ ',
  },
  radio: {
    unchecked: '◯ ',
    checked: '⦿ ',
  },
}
