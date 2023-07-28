import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {View, type Props as ViewProps} from '../View'
import {Style} from '../Style'
import {Point, Size} from '../geometry'
import {
  type MouseEvent,
  isMousePressed,
  isMouseReleased,
  isMouseClicked,
} from '../events'

interface Props extends ViewProps {
  text: string
  style?: Style
}

export class CollapsibleText extends View {
  #text: string
  get text(): string {
    return this.#text
  }
  set text(value: string) {
    if (this.#text === value) {
      return
    }
    this.#text = value.split('\n')[0]
    this.invalidateSize()
  }

  #style: Props['style']
  #isCollapsed = true
  #isPressed = false

  constructor({text, style, ...viewProps}: Props) {
    super(viewProps)

    this.#style = style

    this.#text = text.split('\n')[0]
  }

  naturalSize(availableSize: Size): Size {
    const size = Size.zero.mutableCopy()
    let lineWidth = unicode.lineWidth(this.#text)
    if (this.#isCollapsed) {
      size.width = lineWidth
      size.height = 1
      return size
    }

    if (lineWidth > availableSize.width) {
      lineWidth += 2
    }
    const lineHeight = Math.ceil(lineWidth / availableSize.width)
    size.width = availableSize.width
    size.height += lineHeight
    return size
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressed(event)) {
      this.#isPressed = true
    } else if (isMouseReleased(event)) {
      this.#isPressed = false

      if (isMouseClicked(event)) {
        this.#isCollapsed = !this.#isCollapsed
        this.invalidateSize()
      }
    }
  }

  render(viewport: Viewport) {
    const line = this.#text
    if (!line.length) {
      return
    }

    const width = unicode.lineWidth(line)
    viewport.usingPen(this.#style, pen => {
      const point = new Point(0, 0).mutableCopy()
      let didWrap = false
      let offsetX = 0
      if (viewport.visibleRect.size.width < width) {
        viewport.registerMouse('mouse.button.left')
        viewport.write(
          this.#isCollapsed ? '► ' : '▼ ',
          Point.zero,
          this.theme.text({isPressed: this.#isPressed}),
        )
        offsetX = 2
      }
      point.x = offsetX

      for (const char of unicode.printableChars(line)) {
        const width = unicode.charWidth(char)
        if (width === 0) {
          // track the current style regardless of wether we are printing
          pen.mergePen(Style.fromSGR(char))
          continue
        }

        if (!this.#isCollapsed && point.x >= viewport.contentSize.width) {
          didWrap = true
          point.x = offsetX
          point.y += 1
        }

        if (didWrap && char.match(/\s/)) {
          continue
        }
        didWrap = false

        if (
          point.x >= viewport.visibleRect.minX() &&
          point.x + width - 1 < viewport.visibleRect.maxX()
        ) {
          viewport.write(char, point)
        }

        point.x += width
      }

      point.y += 1
    })
  }
}
