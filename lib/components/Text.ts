import {unicode} from '../sys'

import type {Viewport} from '../Viewport'
import type {Props as ViewProps} from '../View'
import {View} from '../View'
import {Style} from '../Style'
import {Point, Size} from '../geometry'

type Alignment = 'left' | 'right' | 'center'

interface TextProps {
  text: string
  lines?: undefined
}

interface LinesProps {
  text?: undefined
  lines: string[]
}

interface StyleProps {
  style?: Style
  alignment: Alignment
  wrap: boolean
}

type Props = Partial<StyleProps> & (TextProps | LinesProps) & ViewProps

export class Text extends View {
  #text: string
  get text(): string {
    return this.#text
  }
  set text(value: string) {
    if (this.#text === value) {
      return
    }
    this.#text = value
    this.#lines = value.split('\n').map(line => [line, unicode.lineWidth(line)])
    this.invalidateSize()
  }

  #lines: [string, number][]
  #style: StyleProps['style']
  #alignment: StyleProps['alignment']
  #wrap: StyleProps['wrap']

  constructor(
    {text, lines, style, alignment, wrap, ...viewProps}: Props = {text: ''},
  ) {
    super(viewProps)

    this.#style = style
    this.#alignment = alignment ?? 'left'
    this.#wrap = wrap ?? false

    this.#text = text ?? lines.join('\n')
    this.#lines = (lines ?? text.split('\n')).map(line => [
      line,
      unicode.lineWidth(line),
    ])
  }

  naturalSize(availableSize: Size): Size {
    return this.#lines.reduce((size, [, width]) => {
      if (this.#wrap) {
        const lineHeight = 1 + ~~(width / availableSize.width)
        size.width = availableSize.width
        size.height += lineHeight
        return size
      }

      size.width = Math.max(size.width, width)
      size.height += 1
      return size
    }, Size.zero.mutableCopy())
  }

  render(viewport: Viewport) {
    const lines: [string, number][] = this.#lines

    viewport.usingPen(this.#style, pen => {
      const point = new Point(0, 0).mutableCopy()
      for (const [line, width] of lines) {
        if (!line.length) {
          point.y += 1
          continue
        }

        let didWrap = false
        const offsetX =
          this.#alignment === 'left'
            ? 0
            : this.#alignment === 'center'
            ? ~~((viewport.contentSize.width - width) / 2)
            : viewport.contentSize.width - width
        point.x = offsetX
        for (const char of unicode.printableChars(line)) {
          const width = unicode.charWidth(char)
          if (width === 0) {
            // track the current style regardless of wether we are printing
            pen.replacePen(Style.fromSGR(char))
            continue
          }

          if (this.#wrap && point.x >= viewport.contentSize.width) {
            didWrap = true
            point.x = 0
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
          // do not early exit when point.x >= maxX. 'line' may contain ANSI codes that
          // need to be picked up by replacePen.
        }

        point.y += 1
      }
    })
  }
}
