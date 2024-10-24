import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import {View, type Props as ViewProps} from '../View'
import {Style} from '../Style'
import {Point, Size} from '../geometry'
import {
  type MouseEvent,
  isMousePressStart,
  isMousePressExit,
  isMouseClicked,
} from '../events'

interface Props extends ViewProps {
  text: string
  style?: Style
}

export class CollapsibleText extends View {
  #lines: string[] = []
  #style: Props['style']
  #isCollapsed = true
  #isPressed = false

  constructor(props: Props) {
    super(props)
    this.#update(props)
  }

  update(props: Props) {
    this.#update(props)
    super.update(props)
  }

  #update({text, style}: Props) {
    this.#style = style
    this.#lines = text.split('\n')
  }

  get text(): string {
    return this.#lines.join('\n')
  }
  set text(value: string) {
    this.#lines = value.split('\n')
    this.invalidateSize()
  }

  naturalSize(availableSize: Size): Size {
    if (this.#lines.length === 0) {
      return Size.zero
    }

    if (this.#lines.length === 1) {
      const {width: lineWidth, height: lineHeight} = unicode.stringSize(
        this.#lines,
        availableSize.width,
      )
      if (lineWidth <= availableSize.width && lineHeight === 1) {
        return new Size(lineWidth, 1)
      }

      if (this.#isCollapsed) {
        return new Size(lineWidth + 2, 1)
      }

      return new Size(lineWidth + 2, lineHeight)
    }

    if (this.#isCollapsed) {
      const lineWidth = unicode.lineWidth(this.#lines[0])
      if (lineWidth <= availableSize.width) {
        return new Size(lineWidth, 1)
      }

      return new Size(lineWidth + 2, 1)
    }

    const stringSize = new Size(
      unicode.stringSize(this.#lines, availableSize.width),
    ).mutableCopy()
    stringSize.width += 2

    return stringSize
  }

  receiveMouse(event: MouseEvent) {
    if (isMousePressStart(event)) {
      this.#isPressed = true
    } else if (isMousePressExit(event)) {
      this.#isPressed = false

      if (isMouseClicked(event)) {
        this.#isCollapsed = !this.#isCollapsed
        this.invalidateSize()
      }
    }
  }

  render(viewport: Viewport) {
    if (viewport.isEmpty) {
      return
    }

    const lines = this.#lines
    if (!lines.length) {
      return
    }

    viewport.usingPen(this.#style, pen => {
      const {width, height} = unicode.stringSize(
        lines,
        viewport.contentSize.width,
      )
      const point = new Point(0, 0).mutableCopy()
      let offsetX = 0
      if (viewport.visibleRect.size.width < width || height > 1) {
        viewport.registerMouse('mouse.button.left')
        viewport.write(
          this.#isCollapsed ? '► ' : '▼ ',
          Point.zero,
          this.theme.text({isPressed: this.#isPressed}),
        )
        offsetX = 2
      }
      point.x = offsetX

      for (const line of this.#lines) {
        let didWrap = false

        for (const char of unicode.printableChars(line)) {
          const width = unicode.charWidth(char)
          if (width === 0) {
            // track the current style regardless of wether we are printing
            pen.replacePen(Style.fromSGR(char))
            continue
          }

          if (!this.#isCollapsed && point.x >= viewport.contentSize.width) {
            didWrap = true
            point.x = offsetX
            point.y += 1
          }

          // don't print preceding whitespace after line wrap
          if (didWrap && char.match(/\s/)) {
            continue
          }
          didWrap = false

          if (
            point.x >= viewport.visibleRect.minX() &&
            point.x + width - 1 < viewport.visibleRect.maxX() &&
            point.y >= viewport.visibleRect.minY()
          ) {
            viewport.write(char, point)
          }

          point.x += width
        }

        point.y += 1
        if (point.y >= viewport.visibleRect.maxY()) {
          break
        }
        point.x = offsetX
      }
    })
  }
}
